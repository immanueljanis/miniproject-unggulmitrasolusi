<?php

namespace App\Http\Controllers;

use App\Models\Penjualan;
use App\Models\ItemPenjualan;
use App\Models\Barang;
use App\Models\Pelanggan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class PenjualanController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'tgl' => 'sometimes|date',
            'id_pelanggan' => 'sometimes|string',
            'pelanggan_nama' => 'sometimes|string',
            'sort_by' => 'sometimes|in:id_nota,tgl,kode_pelanggan,subtotal,pelanggan_nama,created_at',
            'sort_dir' => 'sometimes|in:asc,desc',
            'per_page' => 'sometimes|integer|min:1|max:100'
        ]);

        $query = Penjualan::select([
                'penjualan.id',
                'penjualan.id_nota',
                'penjualan.tgl',
                // 'penjualan.kode_pelanggan as kode_pelanggan',
                'penjualan.subtotal',
                'pelanggan.nama as pelanggan_nama',
                'pelanggan.id_pelanggan'
            ])
            ->join('pelanggan', 'penjualan.kode_pelanggan', '=', 'pelanggan.id')
            ->withCount('item_penjualan as total_item')
            ->where([['pelanggan.id_pelanggan', 'like', '%' . $request->id_pelanggan . '%']]);

        if ($request->filled('tgl')) {
            $query->whereDate('penjualan.tgl', $request->tgl);
        }

        if ($request->filled('kode_pelanggan')) {
            $query->where('penjualan.kode_pelanggan', $request->kode_pelanggan);
        }

        if ($request->filled('pelanggan_nama')) {
            $query->where('pelanggan.nama', 'like', '%' . $request->pelanggan_nama . '%');
        }

        $sortBy = $request->get('sort_by', 'penjualan.created_at');
        if ($sortBy === 'pelanggan_nama') {
            $sortBy = 'pelanggan.nama';
        } elseif (!str_contains($sortBy, '.')) {
            $sortBy = 'penjualan.' . $sortBy;
        }

        $query->orderBy($sortBy, $request->get('sort_dir', 'desc'));

        $penjualans = $query->paginate($request->get('per_page', 10));

        return response()->json([
            'status' => 'success',
            'message' => 'Get All Penjualan success',
            'data' => $penjualans->items(),
            'meta' => [
                'total' => $penjualans->total(),
                'count' => $penjualans->count(),
                'per_page' => $penjualans->perPage(),
                'current_page' => $penjualans->currentPage(),
                'total_pages' => $penjualans->lastPage()
            ],
            'links' => [
                'first' => $penjualans->url(1),
                'last' => $penjualans->url($penjualans->lastPage()),
                'prev' => $penjualans->previousPageUrl(),
                'next' => $penjualans->nextPageUrl(),
            ],
        ]);
    }

    public function show($id)
    {
        $penjualan = DB::table('penjualan')
            ->join('pelanggan', 'penjualan.kode_pelanggan', '=', 'pelanggan.id')
            ->select(
                'penjualan.id',
                'penjualan.id_nota',
                'penjualan.tgl',
                'pelanggan.id as id_pelanggan',
                'pelanggan.nama as pelanggan_nama',
                'pelanggan.id_pelanggan as pelanggan_kode',
                'penjualan.subtotal'
            )
            ->where([
                ['penjualan.id', $id]
            ])->first();
        
        if(!$penjualan) {
            return response()->json([
                'status' => 'error',
                'message' => 'Penjualan not found',
                'data' => null
            ], 201);
        }

        $item_penjualan = DB::table('item_penjualan')
            ->join('barang', 'barang.id', '=', 'item_penjualan.barang_id')
            ->select(
                'item_penjualan.id',
                'item_penjualan.qty',
                'barang.id as barang_id',
                'barang.nama as barang_nama',
                'barang.harga as barang_harga'
            )
            ->where('item_penjualan.penjualan_id', $id)
            ->get();

        $penjualan->item_penjualan = $item_penjualan;

        return response()->json([
            'status' => 'success',
            'message' => 'Get Single Penjualan success',
            'data' => $penjualan,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tgl' => 'required|date',
            'kode_pelanggan' => 'required|string|max:255',
            'items' => 'required|array',
            'items.*.barang_id' => 'required|integer|exists:barang,id',
            'items.*.qty' => 'required|integer|min:1'
        ]);

        $pelanggan = Pelanggan::find($request->kode_pelanggan);
        if (!$pelanggan) {
            return response()->json([
                'status' => 'error',
                'message' => 'Pelanggan Not Found',
                'data' => null
            ], 404);
        }

        DB::beginTransaction();

        try {
            $barangIds = collect($request->items)->pluck('barang_id');

            $subtotal = Barang::whereIn('id', $barangIds) 
                        ->get()
                        ->sum(function ($barang) use ($request) {
                            $item = collect($request->items)->firstWhere('barang_id', $barang->id);
                            return $barang->harga * $item['qty'];
                        });

            $penjualan = Penjualan::create([
                'tgl' => $request->tgl,
                'kode_pelanggan' => $request->kode_pelanggan,
                'subtotal' => $subtotal
            ]);

            foreach ($request->items as $item) {
                ItemPenjualan::create([
                    'penjualan_id' => $penjualan->id,
                    'barang_id' => $item['barang_id'],
                    'qty' => $item['qty']
                ]);
            }

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Penjualan created successfully',
                'data' => $penjualan
            ], 201);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create Penjualan',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Update Penjualan
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'tgl' => 'sometimes|date',
            'kode_pelanggan' => 'sometimes|string|max:255',
            'items' => 'sometimes|array',
            'items.*.barang_id' => 'required_with:items|integer|exists:barang,id',
            'items.*.qty' => 'required_with:items|integer|min:1'
        ]);

        $penjualan = Penjualan::find($id);
        if (!$penjualan) {
            return response()->json([
                'status' => 'error',
                'message' => 'Penjualan Not Found',
                'data' => null
            ], 404);
        }

        DB::beginTransaction();

        try {
            $updateData = [];

            if ($request->filled('tgl')) {
                $updateData['tgl'] = $request->tgl;
            }

            if ($request->filled('kode_pelanggan')) {
                $updateData['kode_pelanggan'] = $request->kode_pelanggan;

                $kodePelanggan = Pelanggan::find($request->kode_pelanggan);
                if(!$kodePelanggan) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'pelanggan not found',
                        'data' => null
                    ]);
                }
            }

            if ($request->filled('items')) {
                $barangIds = collect($request->items)->pluck('barang_id');
                $barangs = Barang::whereIn('id', $barangIds)->get();

                if ($barangs->count() !== count($barangIds)) {
                    $missingIds = $barangIds->diff($barangs->pluck('id'));
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Some barang not found',
                        'missing_ids' => $missingIds->values()
                    ], 404);
                }

                $subtotal = 0;
                foreach ($request->items as $item) {
                    $barang = $barangs->firstWhere('id', $item['barang_id']);
                    $subtotal += $barang->harga * $item['qty'];
                }

                $updateData['subtotal'] = $subtotal;

                ItemPenjualan::where('penjualan_id', $penjualan->id)->delete();

                foreach ($request->items as $item) {
                    ItemPenjualan::create([
                        'penjualan_id' => $penjualan->id,
                        'barang_id' => $item['barang_id'],
                        'qty' => $item['qty']
                    ]);
                }
            }

            if (!empty($updateData)) {
                $penjualan->update($updateData);
            }

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Penjualan updated successfully',
                'data' => $penjualan
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update Penjualan',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    // Delete Penjualan
    public function destroy($id)
    {
        try {
            $penjualan = Penjualan::where('active', 1)->findOrFail($id);
            $penjualan->update(['active' => 0]);

            return response()->json([
                'status' => 'success',
                'message' => 'Penjualan [' . $penjualan->id_nota . '] deleted successfully'
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Penjualan not found'
            ], 404);

        } catch (\Exception $e) {
            Log::error('Error deleting penjualan: '.$e->getMessage());

            return response()->json([
                'status' => 'error',
                'message' => 'Something went wrong when deleting penjualan'
            ], 500);
        }
    }
}