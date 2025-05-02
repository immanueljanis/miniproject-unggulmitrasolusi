<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Pelanggan extends Model
{
    protected $table = 'pelanggan'; 

    protected $primaryKey = 'id'; 
    protected $keyType = 'string';
    public $incrementing = false; 

    protected $fillable = [
        'id_pelanggan',
        'nama',
        'domisili',
        'jenis_kelamin',
        'active',
    ];

    // Menentukan bahwa 'active' adalah indikator soft delete
    const ACTIVE = 1;
    const INACTIVE = 0;

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            // Generate UUID untuk field id
            if (empty($model->id)) {
                $model->id = (string) Str::uuid();
            }

            $lastNumber = self::count() + 1;
            $model->id_pelanggan = 'PELANGGAN_' . $lastNumber;
        });
    }

    public function softDelete()
    {
        $this->update(['active' => self::INACTIVE]);
    }
}
