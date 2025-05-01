<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ItemPenjualan;
use App\Models\Penjualan;
use App\Models\Barang;

class ItemPenjualanSeeder extends Seeder
{
    public function run()
    {
        $penjualans = Penjualan::all();
        $barangs = Barang::all();

        if ($penjualans->isEmpty() || $barangs->isEmpty()) {
            $this->command->warn('Penjualan atau Barang kosong. Seeder dibatalkan.');
            return;
        }

        foreach ($penjualans as $penjualan) {
            $barangsSample = $barangs->random(rand(2, 3));

            foreach ($barangsSample as $barang) {
                ItemPenjualan::create([
                    'penjualan_id' => $penjualan->id,
                    'barang_id' => $barang->id,
                    'qty' => rand(1, 5),
                ]);
            }
        }
    }
}