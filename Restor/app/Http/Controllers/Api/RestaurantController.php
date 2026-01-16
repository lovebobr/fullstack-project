<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Restaurant;
use Illuminate\Http\Request;

class RestaurantController extends Controller
{
    public function index()
    {
        return Restaurant::with('tables')->get();
    }

    public function show($id)
    {
        return Restaurant::with('tables')->findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
        'name' => 'required|string|max:255',
        'address' => 'required|string|max:255',
        'description' => 'nullable|string',
        ]);

        $defaultSchedule = [];
        for ($day = 1; $day <= 7; $day++) {
            $defaultSchedule[$day] = [
                'is_closed' => false,
                'opening_time' => '10:00',
                'closing_time' => '22:00',
            ];
        }

        $restaurant = Restaurant::create(array_merge($validated, [
            'schedule' => $defaultSchedule
        ]));

        return response()->json($restaurant, 201);
    }

    public function update(Request $request, $id)
    {
        $restaurant = Restaurant::findOrFail($id);
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'address' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'layout_data' => 'nullable|array'
        ]);

        $restaurant->update($validated);

        return response()->json($restaurant);
    }

    public function destroy($id)
    {
        $restaurant = Restaurant::withTrashed()->findOrFail($id);

        if ($restaurant->trashed()) {
            return response()->json(['message' => 'Ресторан уже удален'], 409);
        }

        $restaurant->deleteWithRelations();

        return response()->noContent();
    }
}

