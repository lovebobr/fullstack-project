<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Restaurant;
use App\Models\Table;

class TestDataSeeder extends Seeder
{
    public function run()
    {
        // Пользователи
        $admin = User::firstOrCreate(['email' => 'admin@example.com'], [
            'name' => 'Admin',
            'password' => bcrypt('password'),
            'role' => 'admin',
            'is_blocked' => false,
        ]);

        $manager = User::firstOrCreate(['email' => 'manager@example.com'], [
            'name' => 'Manager User',
            'password' => bcrypt('password'),
            'role' => 'manager',
            'is_blocked' => false,
        ]);

        $user = User::firstOrCreate(['email' => 'sergio@mail.ru'], [
            'name' => 'Sergio',
            'password' => bcrypt('password'),
            'role' => 'user',
            'is_blocked' => false,
        ]);

        $layoutData = [
            "version" => "1.0",
            "tables" => [
                [
                    "id" => "item-1768592178105-fdqavry01",
                    "type" => "table",
                    "tableType" => "table-1",
                    "position" => ["x" => 466, "y" => 276],
                    "size" => ["width" => 70, "height" => 48],
                    "rotation" => 0,
                    "tableNumber" => 1,
                    "tableId" => 1,
                    "seats" => 1,
                    "isBooked" => false
                ],
                [
                    "id" => "item-1768592178639-9odh799eb",
                    "type" => "table",
                    "tableType" => "table-2",
                    "position" => ["x" => 207, "y" => 363],
                    "size" => ["width" => 100, "height" => 90],
                    "rotation" => 0,
                    "tableNumber" => 2,
                    "tableId" => 2,
                    "seats" => 2,
                    "isBooked" => false
                ],
                [
                    "id" => "item-1768592178956-awc57g2ag",
                    "type" => "table",
                    "tableType" => "table-4-1",
                    "position" => ["x" => 253, "y" => 159.5],
                    "size" => ["width" => 90, "height" => 77],
                    "rotation" => 0,
                    "tableNumber" => 3,
                    "tableId" => 3,
                    "seats" => 4,
                    "isBooked" => false
                ],
                [
                    "id" => "item-1768592194439-naojls77l",
                    "type" => "table",
                    "tableType" => "table-4-1",
                    "position" => ["x" => 416, "y" => 384.5],
                    "size" => ["width" => 90, "height" => 77],
                    "rotation" => 0,
                    "tableNumber" => 4,
                    "tableId" => 5,
                    "seats" => 4,
                    "isBooked" => false
                ],
                [
                    "id" => "item-1768592195056-lckxmi4o1",
                    "type" => "table",
                    "tableType" => "table-4-1",
                    "position" => ["x" => 519, "y" => 483.5],
                    "size" => ["width" => 90, "height" => 77],
                    "rotation" => 0,
                    "tableNumber" => 5,
                    "tableId" => 6,
                    "seats" => 4,
                    "isBooked" => false
                ]
            ],
            "walls" => [],
            "windows" => [],
            "metadata" => [
                "canvasSize" => ["width" => 900, "height" => 700],
                "lastModified" => "2026-01-16T19:36:42.707Z"
            ]
        ];

        // Рестораны
        $restaurant1 = Restaurant::firstOrCreate(
            ['name' => 'La Tavola'],
            [
                'address' => 'Via Roma 12, Milano',
                'description' => 'Современный итальянский ресторан с домашней пастой и вином.',
                'schedule' => $this->getDefaultSchedule(),
                'layout_data' => $layoutData,
            ]
        );

        $restaurant2 = Restaurant::firstOrCreate(
            ['name' => 'Sushi Time'],
            [
                'address' => 'Shinjuku 5-2-1, Tokyo',
                'description' => 'Аутентичные японские суши и сашими от шефа из Киото.',
                'schedule' => $this->getDefaultSchedule(),
                'layout_data' => $layoutData,
            ]
        );

        // Столы
// Для La Tavola
        Table::firstOrCreate(
            ['number' => 1, 'restaurant_id' => $restaurant1->id],
            ['seats' => 1]
        );
        Table::firstOrCreate(
            ['number' => 2, 'restaurant_id' => $restaurant1->id],
            ['seats' => 2]
        );
        Table::firstOrCreate(
            ['number' => 3, 'restaurant_id' => $restaurant1->id],
            ['seats' => 4]
        );
        Table::firstOrCreate(
            ['number' => 4, 'restaurant_id' => $restaurant1->id],
            ['seats' => 4]
        );
        Table::firstOrCreate(
            ['number' => 5, 'restaurant_id' => $restaurant1->id],
            ['seats' => 4]
        );

        Table::firstOrCreate(
            ['number' => 1, 'restaurant_id' => $restaurant2->id],
            ['seats' => 1]
        );
        Table::firstOrCreate(
            ['number' => 2, 'restaurant_id' => $restaurant2->id],
            ['seats' => 2]
        );
        Table::firstOrCreate(
            ['number' => 3, 'restaurant_id' => $restaurant2->id],
            ['seats' => 4]
        );
        Table::firstOrCreate(
            ['number' => 4, 'restaurant_id' => $restaurant2->id],
            ['seats' => 4]
        );
        Table::firstOrCreate(
            ['number' => 5, 'restaurant_id' => $restaurant2->id],
            ['seats' => 4]
        );
}

    private function getDefaultSchedule(): array
    {
        $schedule = [];
        for ($day = 1; $day <= 7; $day++) {
            $schedule[$day] = [
                'is_closed' => false,
                'opening_time' => '10:00',
                'closing_time' => '23:00',
            ];
        }
        return $schedule;
    }
}