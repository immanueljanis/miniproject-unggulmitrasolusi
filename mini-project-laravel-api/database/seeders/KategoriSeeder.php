<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Kategori;

class KategoriSeeder extends Seeder
{
    public function run()
    {
        $data = [
            ['nama' => 'Elektronik', 'active' => 1],
            ['nama' => 'Pakaian', 'active' => 1],
            ['nama' => 'Makanan', 'active' => 1],
            ['nama' => 'Peralatan Rumah Tangga', 'active' => 1],
        ];

        foreach ($data as $kategori) {
            Kategori::create($kategori);
        }
    }
}
