<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Barang;
use App\Models\Kategori;
use Illuminate\Support\Str;

class BarangSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Pastikan ada kategori dulu
        if (Kategori::count() === 0) {
            $this->command->warn('Seeder aborted: tidak ada data kategori. Jalankan KategoriSeeder terlebih dahulu.');
            return;
        }

        // Ambil semua kategori aktif
        $kategoriList = Kategori::where('active', 1)->pluck('id')->toArray();

        // Buat data dummy barang
        foreach (range(1, 10) as $i) {
            Barang::create([
                'kode'     => 'BRG' . str_pad($i, 4, '0', STR_PAD_LEFT),
                'nama'     => 'Barang Ke-' . $i,
                'kategori' => fake()->randomElement($kategoriList),
                'harga'    => fake()->numberBetween(10000, 100000),
                'active'   => 1
            ]);
        }
    }
}
