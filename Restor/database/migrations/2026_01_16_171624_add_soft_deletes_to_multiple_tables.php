<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('restaurants', function (Blueprint $table) {
            $table->softDeletes();
        });

        Schema::table('tables', function (Blueprint $table) {
            $table->softDeletes();
        });

        Schema::table('reservations', function (Blueprint $table) {
            $table->softDeletes();
        });

        Schema::table('foods', function (Blueprint $table) {
            $table->softDeletes();
        });

        Schema::table('payments', function (Blueprint $table) {
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::table('restaurants', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('tables', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('reservations', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('foods', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('payments', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
    }
};