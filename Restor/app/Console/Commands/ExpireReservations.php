<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Reservation;
use Carbon\Carbon;

class ExpireReservations extends Command
{
    protected $signature = 'reservations:expire';
    protected $description = 'Mark confirmed reservations as expired if end_time < now';

    public function handle()
    {
        $now = Carbon::now();
        $this->info("Сейчас: " . $now->toDateTimeString());
        $this->info("Поиск");

        $reservations = Reservation::where('status', 'confirmed')
            ->where('end_time', '<', $now)
            ->get();

        if ($reservations->isEmpty()) {
            $this->warn("Не найдено");
            
            $sample = Reservation::where('status', 'confirmed')->first();
            if ($sample) {
                $this->info("Первая запись:");
                $this->info("   ID: {$sample->id}");
                $this->info("   end_time: {$sample->end_time}");
                $this->info("   status: {$sample->status}");
            } else {
                $this->info("Нету броней");
            }
        } else {
            foreach ($reservations as $r) {
                $this->info("Найдено: ID={$r->id}, end_time={$r->end_time}, status={$r->status}");
            }

            $count = Reservation::where('status', 'confirmed')
                ->where('end_time', '<', $now)
                ->update(['status' => 'expired']);

            $this->info(" {$count} броней переведено в новый статус");
        }
    }
}