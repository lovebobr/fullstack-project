<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Restaurant extends Model
{
    use SoftDeletes;

    protected $fillable = ['name', 'address', 'description', 'layout_data', 'schedule'];

    protected $casts = [
        'layout_data' => 'array',
        'schedule' => 'array',
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

    public function deleteWithRelations(): void
    {
        $this->tables()->delete();

        Reservation::whereIn('table_id', $this->tables()->pluck('id'))->delete();

        Payment::whereIn('reservation_id', 
            Reservation::whereIn('table_id', $this->tables()->pluck('id'))
                ->withTrashed()
                ->pluck('id')
        )->delete();

        $this->delete();
    }
}
