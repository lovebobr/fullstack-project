<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Restaurant extends Model
{
    protected $fillable = ['name', 'address', 'description', 'layout_data'];

    protected $casts = [
        'layout_data' => 'array',
    ];
    public function tables()
    {
        return $this->hasMany(Table::class);
    }
    public function managers()
{
    return $this->belongsToMany(User::class, 'restaurant_manager', 'restaurant_id', 'manager_id')
                ->where('role', User::ROLE_MANAGER);
}
}
