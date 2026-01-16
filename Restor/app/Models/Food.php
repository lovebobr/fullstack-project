<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Food extends Model
{
    use SoftDeletes;
    protected $table = 'foods';
    protected $fillable = [
        'name',
        'image_url',
        'calories',
        'ingredients',
        'price',
    ];

    public function reservations()
    {
        return $this->belongsToMany(Reservation::class)
            ->withPivot(['quantity'])
            ->withTimestamps();
    }
}

