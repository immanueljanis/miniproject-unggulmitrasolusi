<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Barang extends Model
{
    protected $table = 'barang';

    protected $fillable = [
        'kode',
        'nama',
        'kategori',
        'harga',
        'active'
    ];

    const ACTIVE = 1;
    const INACTIVE = 0;

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {

            $lastNumber = self::count() + 1;
            $model->kode = 'BARANG_' . $lastNumber;
        });
    }

    public function softDelete()
    {
        $this->update(['active' => self::INACTIVE]);
    }

    public function kategori()
    {
        return $this->belongsTo(Kategori::class, 'kategori');
    }
}
