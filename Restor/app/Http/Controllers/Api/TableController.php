<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Table;
use Illuminate\Http\Request;

class TableController extends Controller
{
    public function index($restaurantId)
    {
        $tables = Table::where('restaurant_id', $restaurantId)
            ->with(['reservations'])
            ->orderBy('number')
            ->get();

        return response()->json($tables);
    }

    public function store(Request $request, $restaurantId)
    {
        if (!$request->user()->isAdmin() && !$request->user()->isManager()) {
            return response()->json(['message' => 'Нужен аккаунт администратора/менеджера'], 403);
        }

        $data = $request->validate([
            'number' => 'required|integer|min:1',
            'seats' => 'required|integer|min:1|max:20',
        ]);

        $exists = Table::where('restaurant_id', $restaurantId)
            ->where('number', $data['number'])
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Стол с таким номером уже существует в данном ресторане'
            ], 409);
        }

        $table = Table::create([
            'restaurant_id' => $restaurantId,
            'number' => $data['number'],
            'seats' => $data['seats'],
        ]);

        return response()->json($table, 201);
    }

    public function update(Request $request, $id)
    {
        if (!$request->user()->isAdmin() && !$request->user()->isManager()) {
            return response()->json(['message' => 'Нужен аккаунт администратора/менеджера'], 403);
        }

        $table = Table::findOrFail($id);

        $data = $request->validate([
            'number' => 'sometimes|integer|min:1',
            'seats' => 'sometimes|integer|min:1|max:20',
        ]);

        if (isset($data['number']) && $data['number'] != $table->number) {
            $exists = Table::where('restaurant_id', $table->restaurant_id)
                ->where('number', $data['number'])
                ->where('id', '!=', $table->id)
                ->exists();

            if ($exists) {
                return response()->json([
                    'message' => 'Стол с таким номером уже существует в данном ресторане'
                ], 409);
            }
        }

        $table->update($data);
        return response()->json($table);
    }

    public function destroy(Request $request, $id)
    {
        if (!$request->user()->isAdmin() && !$request->user()->isManager()) {
            return response()->json(['message' => 'Нужен аккаунт администратора/менеджера'], 403);
        }

        $table = Table::findOrFail($id);
        $table->reservations()->delete();
        $table->delete();
        return response()->noContent();
    }
    public function checkAvailability(Request $request)
    {
        $data = $request->validate([
            'table_id' => 'required|exists:tables,id',
            'date_time' => 'required|date',
        ]);

        $isTaken = Reservation::where('table_id', $data['table_id'])
            ->where('date_time', $data['date_time'])
            ->whereIn('status', ['pending', 'confirmed'])
            ->exists();

        return response()->json([
            'available' => !$isTaken,
            'message' => $isTaken ? 'Стол занят на это время' : 'Стол свободен'
        ]);
    }
}

