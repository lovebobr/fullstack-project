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


    // GET /api/admin/users - список всех пользователей
    public function getUsers(Request $request)
    {
        $users = User::withCount(['reservations', 'payments'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($users);
    }

    // POST /api/admin/users/{id}/block - блокировка пользователя
    public function blockUser($id, Request $request)
    {
        $user = User::findOrFail($id);

        if ($user->isAdmin()) {
            return response()->json([
                'message' => 'Cannot block admin user'
            ], 422);
        }

        $user->update(['is_blocked' => true]);

        return response()->json([
            'message' => 'User blocked successfully',
            'user' => $user
        ]);
    }

    // POST /api/admin/users/{id}/unblock - разблокировка пользователя
    public function unblockUser($id, Request $request)
    {
        $user = User::findOrFail($id);
        $user->update(['is_blocked' => false]);

        return response()->json([
            'message' => 'User unblocked successfully',
            'user' => $user
        ]);
    }

    // PUT /api/admin/users/{id} - обновление пользователя
    public function updateUser($id, Request $request)
    {
        $user = User::findOrFail($id);
        $currentAdmin = $request->user();

        // Админ не может редактировать другого админа
        if ($user->isAdmin() && $user->id !== $currentAdmin->id) {
            return response()->json([
                'message' => 'Cannot edit another admin user'
            ], 422);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'password' => 'sometimes|string|min:6',
            'role' => 'sometimes|in:' . User::ROLE_USER . ',' . User::ROLE_MANAGER . ',' . User::ROLE_ADMIN,
            'is_blocked' => 'sometimes|boolean',
        ]);

        // Админ не может изменить роль другого админа
        if (isset($validated['role']) && $user->isAdmin() && $user->id !== $currentAdmin->id) {
            return response()->json([
                'message' => 'Cannot change role of another admin user'
            ], 422);
        }

        // Хешируем пароль, если он передан
        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user->fresh()
        ]);
    }

    // PATCH /api/admin/users/{id}/role
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

    // DELETE /api/admin/users/{id} - удаление пользователя
    public function deleteUser($id, Request $request)
    {
        $user = User::findOrFail($id);

        if ($user->isAdmin()) {
            return response()->json([
                'message' => 'Cannot delete admin user'
            ], 422);
        }

        $user->reservations()->delete();
        $user->payments()->delete();
        $user->tokens()->delete();
        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }

    // === MANAGER MANAGEMENT ===

    // GET /api/admin/managers - список менеджеров
    public function getManagers(Request $request)
    {
        $managers = User::managers()
            ->withCount(['reservations', 'payments'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($managers);
    }

    // POST /api/admin/managers - создание менеджера
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

    // POST /api/admin/managers/{id}/block - блокировка менеджера
    public function blockManager($id, Request $request)
    {
        $manager = User::managers()->findOrFail($id);
        $manager->update(['is_blocked' => true]);

        return response()->json([
            'message' => 'Manager blocked successfully',
            'manager' => $manager
        ]);
    }

    // POST /api/admin/managers/{id}/unblock - разблокировка менеджера
    public function unblockManager($id, Request $request)
    {
        $manager = User::managers()->findOrFail($id);
        $manager->update(['is_blocked' => false]);

        return response()->json([
            'message' => 'Manager unblocked successfully',
            'manager' => $manager
        ]);
    }

    // DELETE /api/admin/managers/{id} - удаление менеджера
    public function deleteManager($id, Request $request)
    {
        $manager = User::managers()->findOrFail($id);

        $manager->reservations()->delete();
        $manager->payments()->delete();
        $manager->tokens()->delete();
        $manager->delete();

        return response()->json(['message' => 'Manager deleted successfully']);
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


    // GET /api/admin/reservations - список всех бронирований
    public function getReservations(Request $request)
    {
        try {
            \Log::info('=== ADMIN RESERVATIONS START ===');

            // Проверка авторизации
            if (!$request->user()) {
                \Log::warning('Unauthorized access attempt');
                return response()->json([
                    'error' => 'Unauthorized',
                    'message' => 'Authentication required'
                ], 401);
            }

            // Проверка роли
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
                    'message' => 'Admin or manager access required',
                    'user_role' => $user->role
                ], 403);
            }

            // Загружаем бронирования с отношениями
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

                        // Данные пользователя
                        'user' => [
                            'id' => $reservation->user->id ?? null,
                            'name' => $reservation->user->name ?? null,
                            'email' => $reservation->user->email ?? null,
                            'phone' => $reservation->user->phone ?? null,
                        ],

                        // Данные стола
                        'table' => [
                            'id' => $reservation->table->id ?? null,
                            'number' => $reservation->table->number ?? null,
                            'seats' => $reservation->table->seats ?? null,
                            'restaurant_id' => $reservation->table->restaurant_id ?? null,
                        ],

                        // Данные ресторана
                        'restaurant' => [
                            'id' => $reservation->table->restaurant->id ?? null,
                            'name' => $reservation->table->restaurant->name ?? null,
                        ],

                        // Основные данные брони
                        'date_time' => $reservation->date_time,
                        'duration' => $reservation->duration,
                        'end_time' => $reservation->end_time,
                        'guests_count' => $reservation->guests_count,
                        'special_requests' => $reservation->special_requests,
                        'price' => $reservation->price,
                        'status' => $reservation->status,
                        'user_name' => $reservation->user_name,

                        // Даты
                        'created_at' => $reservation->created_at,
                        'updated_at' => $reservation->updated_at,
                    ];
                });

            \Log::info('Reservations loaded', [
                'count' => $reservations->count(),
                'sample' => $reservations->first()
            ]);

            // ВАЖНО: Возвращаем ПРОСТО МАССИВ для фронтенда
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

    // PUT /api/admin/reservations/{id} - обновление статуса бронирования
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

    // DELETE /api/admin/reservations/{id} - удаление бронирования
    public function deleteReservation($id, Request $request)
    {
        try {
            \Log::info('Delete reservation request', ['reservation_id' => $id]);

            $reservation = Reservation::findOrFail($id);

            // Можно добавить проверку прав
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
