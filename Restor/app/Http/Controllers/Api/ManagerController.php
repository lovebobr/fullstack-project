<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class ManagerController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function getUsers(Request $request)
    {
        $users = User::users()
            ->withCount(['reservations', 'payments'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($users);
    }

    public function blockUser($id, Request $request)
    {
        $user = User::users()->findOrFail($id);
        $user->update(['is_blocked' => true]);

        return response()->json([
            'message' => 'User blocked successfully',
            'user' => $user
        ]);
    }

    public function unblockUser($id, Request $request)
    {
        $user = User::users()->findOrFail($id);
        $user->update(['is_blocked' => false]);

        return response()->json([
            'message' => 'User unblocked successfully',
            'user' => $user
        ]);
    }
}
