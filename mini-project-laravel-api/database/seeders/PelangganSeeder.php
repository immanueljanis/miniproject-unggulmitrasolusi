<?php

namespace Database\Seeders;

use App\Models\Pelanggan;
use Illuminate\Database\Seeder;

class PelangganSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $pelanggans = [
            [
                'nama' => 'Andi',
                'domisili' => 'Jak-Ut',
                'jenis_kelamin' => 'Pria',
                'active' => 1,
            ],
            [
                'nama' => 'Budi',
                'domisili' => 'Jak-Bar',
                'jenis_kelamin' => 'Pria',
                'active' => 1,
            ],
            [
                'nama' => 'Johan',
                'domisili' => 'Jak-Sel',
                'jenis_kelamin' => 'Pria',
                'active' => 1,
            ],
            [
                'nama' => 'Sintha',
                'domisili' => 'Jak-Tim',
                'jenis_kelamin' => 'Wanita',
                'active' => 1,
            ],
            [
                'nama' => 'Anto',
                'domisili' => 'Jak-Ut',
                'jenis_kelamin' => 'Pria',
                'active' => 1,
            ],
            [
                'nama' => 'Bujang',
                'domisili' => 'Jak-Bar',
                'jenis_kelamin' => 'Pria',
                'active' => 1,
            ],
            [
                'nama' => 'Jowan',
                'domisili' => 'Jak-Sel',
                'jenis_kelamin' => 'Pria',
                'active' => 1,
            ],
            [
                'nama' => 'Sintia',
                'domisili' => 'Jak-Tim',
                'jenis_kelamin' => 'Wanita',
                'active' => 1,
            ],
            [
                'nama' => 'Butet',
                'domisili' => 'Jak-Bar',
                'jenis_kelamin' => 'Wanita',
                'active' => 1,
            ],
            [
                'nama' => 'Jonny',
                'domisili' => 'Jak-Sel',
                'jenis_kelamin' => 'Wanita',
                'active' => 1,
            ],
        ];

        foreach ($pelanggans as $pelanggan) {
            Pelanggan::create($pelanggan);
        }
    }
}