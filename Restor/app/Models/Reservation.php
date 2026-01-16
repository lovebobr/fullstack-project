<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Reservation extends Model
{
    use SoftDeletes;
    const STATUS_PENDING = 'pending';
    const STATUS_CONFIRMED = 'confirmed';
    const STATUS_CANCELED = 'canceled';
    const STATUS_EXPIRED = 'expired';

    protected $fillable = [
        'user_id',
        'table_id',
        'date_time',
        'duration',
        'end_time',
        'status',
        'price',
        'user_name',
        'user_phone',
        'guests_count',
        'special_requests'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function table()
    {
        return $this->belongsTo(Table::class);
    }

    public function foods()
    {
        return $this->belongsToMany(Food::class)
            ->withPivot(['quantity'])
            ->withTimestamps();
    }
}
