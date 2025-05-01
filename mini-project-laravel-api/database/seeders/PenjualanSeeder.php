<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Penjualan;
use App\Models\Pelanggan;
use Carbon\Carbon;

class PenjualanSeeder extends Seeder
{
    public function run()
    {
        // Pastikan ada data pelanggan terlebih dahulu
        if (Pelanggan::count() === 0) {
            $this->call(PelangganSeeder::class);
        }

        $pelanggans = Pelanggan::pluck('id')->toArray();

        $dataPenjualan = [
            [
                'tgl' => Carbon::now()->subDays(5)->format('Y-m-d'),
                'kode_pelanggan' => $pelanggans[0] ?? null,
                'subtotal' => 1500000,
                'active'   => 1
            ],
            [
                'tgl' => Carbon::now()->subDays(3)->format('Y-m-d'),
                'kode_pelanggan' => $pelanggans[1] ?? null,
                'subtotal' => 2500000,
                'active'   => 1
            ],
            [
                'tgl' => Carbon::now()->subDays(1)->format('Y-m-d'),
                'kode_pelanggan' => $pelanggans[2] ?? null,
                'subtotal' => 1800000,
                'active'   => 1
            ],
            [
                'tgl' => Carbon::now()->format('Y-m-d'),
                'kode_pelanggan' => $pelanggans[3] ?? null,
                'subtotal' => 3200000,
                'active'   => 1
            ],
        ];

        foreach ($dataPenjualan as $penjualan) {
            Penjualan::create($penjualan);
        }

        // Atau menggunakan factory jika ingin data random dalam jumlah banyak
        // Penjualan::factory(20)->create();
    }
}