<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('restaurant_manager', function (Blueprint $table) {
            $table->id();
            $table->foreignId('restaurant_id')->constrained()->onDelete('cascade');
            $table->foreignId('manager_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();

            // Уникальность пары: один менеджер не может быть привязан к одному ресторану дважды
            $table->unique(['restaurant_id', 'manager_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('restaurant_manager');
    }
};