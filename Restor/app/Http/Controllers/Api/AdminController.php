<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function getUsers(Request $request)
    {
        $users = User::withCount(['reservations', 'payments'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($users);
    }

    public function blockUser($id, Request $request)
    {
        $user = User::findOrFail($id);

        if ($user->isAdmin()) {
            return response()->json([
                'message' => 'Нельзя заблокировать администратора'
            ], 422);
        }

        $user->update(['is_blocked' => true]);

        return response()->json([
            'message' => 'Пользователь заблокирован',
            'user' => $user
        ]);
    }

    public function unblockUser($id, Request $request)
    {
        $user = User::findOrFail($id);
        $user->update(['is_blocked' => false]);

        return response()->json([
            'message' => 'Пользователь разблокирован',
            'user' => $user
        ]);
    }

    public function updateUser($id, Request $request)
    {
        $user = User::findOrFail($id);
        $currentAdmin = $request->user();

        if ($user->isAdmin() && $user->id !== $currentAdmin->id) {
            return response()->json([
                'message' => 'Вы не можете менять других администраторов'
            ], 422);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'password' => 'sometimes|string|min:6',
            'role' => 'sometimes|in:' . User::ROLE_USER . ',' . User::ROLE_MANAGER . ',' . User::ROLE_ADMIN,
            'is_blocked' => 'sometimes|boolean',
        ]);

        if (isset($validated['role']) && $user->isAdmin() && $user->id !== $currentAdmin->id) {
            return response()->json([
                'message' => 'Вы не можете менять других администраторов'
            ], 422);
        }

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        return response()->json([
            'message' => 'Юзер обновлен',
            'user' => $user->fresh()
        ]);
    }

    public function updateRole(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $currentAdmin = $request->user();

        // Текущий пользователь должен быть админом
        if (!$currentAdmin->isAdmin()) {
            return response()->json(['message' => 'Only admin can change roles'], 403);
        }

        // Админ не может менять роль другого админа
        if ($user->isAdmin() && $user->id !== $currentAdmin->id) {
            return response()->json(['message' => 'Cannot change role of another admin'], 422);
        }

        $validated = $request->validate([
            'role' => 'required|in:' . User::ROLE_USER . ',' . User::ROLE_MANAGER,
        ]);

        $user->update(['role' => $validated['role']]);

        return response()->json([
            'message' => 'Role updated successfully',
            'user' => $user->only('id', 'name', 'email', 'role')
        ]);
    }

    public function deleteUser($id, Request $request)
    {
        $user = User::findOrFail($id);

        if ($user->isAdmin()) {
            return response()->json([
                'message' => 'Нельзя удалить админа'
            ], 422);
        }

        $user->reservations()->delete();
        $user->payments()->delete();
        $user->tokens()->delete();
        $user->delete();

        return response()->json(['message' => 'Пользователь удален']);
    }

    public function getManagers(Request $request)
    {
        $managers = User::managers()
            ->withCount(['reservations', 'payments'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($managers);
    }

    public function createManager(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $manager = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => User::ROLE_MANAGER,
        ]);

        return response()->json($manager, 201);
    }

    public function blockManager($id, Request $request)
    {
        $manager = User::managers()->findOrFail($id);
        $manager->update(['is_blocked' => true]);

        return response()->json([
            'message' => 'Менеджер заблокирован',
            'manager' => $manager
        ]);
    }

    public function unblockManager($id, Request $request)
    {
        $manager = User::managers()->findOrFail($id);
        $manager->update(['is_blocked' => false]);

        return response()->json([
            'message' => 'Менеджер разблокирован',
            'manager' => $manager
        ]);
    }

    public function deleteManager($id, Request $request)
    {
        $manager = User::managers()->findOrFail($id);

        $manager->reservations()->delete();
        $manager->payments()->delete();
        $manager->tokens()->delete();
        $manager->delete();

        return response()->json(['message' => 'Менеджер удален']);
    }

    public function assignManager(Request $request, $restaurantId)
    {
        $request->validate(['manager_id' => 'required|exists:users,id']);
        $restaurant = Restaurant::findOrFail($restaurantId);
        $manager = User::where('id', $request->manager_id)->where('role', User::ROLE_MANAGER)->firstOrFail();

        $restaurant->managers()->attach($manager);
        return response()->json(['message' => 'Manager assigned']);
    }

    public function removeManager($restaurantId, $managerId)
    {
        $restaurant = Restaurant::findOrFail($restaurantId);
        $restaurant->managers()->detach($managerId);
        return response()->json(['message' => 'Manager removed']);
    }

    public function getReservations(Request $request)
    {
        try {
            if (!$request->user()) {
                \Log::warning('Unauthorized access attempt');
                return response()->json([
                    'error' => 'Unauthorized',
                    'message' => 'Запрос авторизации'
                ], 401);
            }
            $user = $request->user();
            \Log::info('Request user:', [
                'id' => $user->id,
                'role' => $user->role,
                'name' => $user->name
            ]);

            if (!in_array($user->role, [User::ROLE_ADMIN, User::ROLE_MANAGER])) {
                \Log::warning('Forbidden access attempt', ['user_role' => $user->role]);
                return response()->json([
                    'error' => 'Forbidden',
                    'message' => 'Доступ только для администратора или менеджера',
                    'user_role' => $user->role
                ], 403);
            }

            $reservations = Reservation::with([
                'user:id,name,email',
                'table:id,number,seats,restaurant_id',
                'table.restaurant:id,name'
            ])
                ->orderBy('date_time', 'desc')
                ->get()
                ->map(function ($reservation) {
                    \Log::debug('Processing reservation', [
                        'id' => $reservation->id,
                        'user_id' => $reservation->user_id,
                        'table_id' => $reservation->table_id
                    ]);

                    return [
                        'id' => $reservation->id,
                        'user_id' => $reservation->user_id,
                        'table_id' => $reservation->table_id,

                        'user' => [
                            'id' => $reservation->user->id ?? null,
                            'name' => $reservation->user->name ?? null,
                            'email' => $reservation->user->email ?? null,
                            'phone' => $reservation->user->phone ?? null,
                        ],

                        'table' => [
                            'id' => $reservation->table->id ?? null,
                            'number' => $reservation->table->number ?? null,
                            'seats' => $reservation->table->seats ?? null,
                            'restaurant_id' => $reservation->table->restaurant_id ?? null,
                        ],

                        'restaurant' => [
                            'id' => $reservation->table->restaurant->id ?? null,
                            'name' => $reservation->table->restaurant->name ?? null,
                        ],

                        'date_time' => $reservation->date_time,
                        'duration' => $reservation->duration,
                        'end_time' => $reservation->end_time,
                        'guests_count' => $reservation->guests_count,
                        'special_requests' => $reservation->special_requests,
                        'price' => $reservation->price,
                        'status' => $reservation->status,
                        'user_name' => $reservation->user_name,

                        'created_at' => $reservation->created_at,
                        'updated_at' => $reservation->updated_at,
                    ];
                });

            \Log::info('Reservations loaded', [
                'count' => $reservations->count(),
                'sample' => $reservations->first()
            ]);

            return response()->json($reservations);

        } catch (\Exception $e) {
            \Log::error('Error in getReservations: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Internal server error',
                'message' => config('app.debug') ? $e->getMessage() : 'Server error occurred',
                'debug' => config('app.debug') ? [
                    'file' => $e->getFile(),
                    'line' => $e->getLine()
                ] : null
            ], 500);
        }
    }

    public function updateReservation($id, Request $request)
    {
        try {
            \Log::info('Update reservation request', [
                'reservation_id' => $id,
                'data' => $request->all()
            ]);

            $reservation = Reservation::findOrFail($id);

            $validated = $request->validate([
                'status' => 'required|in:pending,confirmed,cancelled,completed,no_show,active',
                'price' => 'sometimes|numeric|min:0',
                'duration' => 'sometimes|integer|min:1',
                'guests_count' => 'sometimes|integer|min:1',
            ]);

            $reservation->update($validated);

            \Log::info('Reservation updated successfully', [
                'id' => $reservation->id,
                'new_status' => $reservation->status
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Reservation updated successfully',
                'reservation' => $reservation->fresh()
            ]);

        } catch (\Exception $e) {
            \Log::error('Error updating reservation: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to update reservation',
                'message' => $e->getMessage()
            ], 500);
        }
    }
    
    public function deleteReservation($id, Request $request)
    {
        try {
            \Log::info('Delete reservation request', ['reservation_id' => $id]);

            $reservation = Reservation::findOrFail($id);

            $user = $request->user();
            if (!in_array($user->role, [User::ROLE_ADMIN, User::ROLE_MANAGER])) {
                return response()->json([
                    'success' => false,
                    'error' => 'Forbidden',
                    'message' => 'Insufficient permissions'
                ], 403);
            }

            $reservation->delete();

            \Log::info('Reservation deleted successfully', ['id' => $id]);

            return response()->json([
                'success' => true,
                'message' => 'Reservation deleted successfully'
            ]);

        } catch (\Exception $e) {
            \Log::error('Error deleting reservation: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'error' => 'Failed to delete reservation',
                'message' => $e->getMessage()
            ], 500);
        }
    }

}
