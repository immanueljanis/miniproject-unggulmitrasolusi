<?php

namespace App\Models;

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Eloquent\Model;

class Penjualan extends Model
{
    protected $table = 'penjualan';

    protected $fillable = [
        'id_nota',
        'tgl',
        'kode_pelanggan',
        'subtotal',
        'active'
    ];

    const ACTIVE = 1;
    const INACTIVE = 0;

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {

            $lastNumber = self::count() + 1;
            $model->id_nota = 'NOTA_' . $lastNumber;
        });
    }

    public function softDelete()
    {
        $this->update(['active' => self::INACTIVE]);
    }

    public function item_penjualan()
    {
        return $this->hasMany(ItemPenjualan::class, 'penjualan_id');
    }
}
