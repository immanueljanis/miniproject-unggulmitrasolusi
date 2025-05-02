<?php

namespace App\Http\Controllers;

use App\Models\Barang;
use App\Models\Kategori;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class BarangController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'sometimes|string|max:255',
            'kode' => 'sometimes|string|max:50',
            'kategori' => 'sometimes|string|max:100',
            'sort_by' => 'sometimes|in:id,kode,nama,kategori,harga,created_at',
            'sort_dir' => 'sometimes|in:asc,desc',
            'per_page' => 'sometimes|integer|min:1|max:100'
        ]);

        $query = Barang::where('active', 1)->with(['kategori' => function ($q) {
            $q->select('id', 'nama');
        }])->select(['id', 'kode', 'nama', 'kategori', 'harga', 'active']);

        // FILTERING berdasarkan nama barang dan kode
        if ($request->filled('nama')) {
            $query->where('nama', 'like', '%' . $request->nama . '%');
        }

        if ($request->filled('kode')) {
            $query->where('kode', 'like', '%' . $request->kode . '%');
        }

        // FILTERING berdasarkan nama kategori (dari tabel relasi)
        if ($request->filled('kategori')) {
            $query->whereHas('kategori', function ($q) use ($request) {
                $q->where('nama', 'like', '%' . $request->kategori . '%');
            });
        }

        // SORTING
        $sortBy = $request->get('sort_by', 'created_at');
        $sortDir = $request->get('sort_dir', 'desc');
        $query->orderBy($sortBy, $sortDir);

        $perPage = $request->get('per_page', 10);
        $barangs = $query->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'message' => 'Get All Barang success',
            'data' => $barangs->items(),
            'meta' => [
                'total' => $barangs->total(),
                'count' => $barangs->count(),
                'per_page' => $barangs->perPage(),
                'current_page' => $barangs->currentPage(),
                'total_pages' => $barangs->lastPage()
            ],
            'links' => [
                'first' => $barangs->url(1),
                'last' => $barangs->url($barangs->lastPage()),
                'prev' => $barangs->previousPageUrl(),
                'next' => $barangs->nextPageUrl(),
            ],
        ]);
    }

    public function show($id)
    {
        $barang = Barang::with(['kategori' => function ($q) {
            $q->select('id', 'nama', 'active');
        }])->select([
            'id',
            'kode',
            'nama',
            'kategori',
            'harga',
            'active'
        ])->find($id);

        return response()->json([
            'status' => $barang ? 'success' : 'error',
            'message' => $barang ? 'Get Single Barang success' : 'Barang Not Found',
            'data' => $barang ? $barang : null
        ], 200);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'nama' => 'required|string|max:255',
                'kategori' => 'required|integer',
                'harga' => 'required|integer|min:0'
            ]);

            $barang = Barang::create($validated);
    
            return response()->json([
                'status' => 'success',
                'message' => 'Barang created successfully',
                'data' => $barang
            ], 201);
    

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $e->errors()
            ], 422);
    
        } catch (\Exception $e) {
            Log::error('Error creating barang: ' . $e->getMessage());
    
            return response()->json([
                'status' => 'error',
                'message' => 'Something went wrong when creating barang'
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'nama' => 'sometimes|string|max:255',
                'kategori' => 'sometimes|integer',
                'harga' => 'sometimes|integer|min:0'
            ]);

            $barang = Barang::where('active', 1)->findOrFail($id);
            $barang->update($validated);

            return response()->json([
                'status' => 'success',
                'message' => 'Barang updated successfully',
                'data' => $barang
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $e->errors()
            ], 422);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Barang not found'
            ], 404);

        } catch (\Exception $e) {
            Log::error('Error updating barang: ' . $e->getMessage());

            return response()->json([
                'status' => 'error',
                'message' => 'Something went wrong when updating barang'
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $barang = Barang::where('active', 1)->findOrFail($id);
            $barang->update(['active' => 0]);

            return response()->json([
                'status' => 'success',
                'message' => 'Barang [' . $barang->kode . '] deleted successfully'
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Barang not found'
            ], 404);

        } catch (\Exception $e) {
            Log::error('Error deleting barang: ' . $e->getMessage());

            return response()->json([
                'status' => 'error',
                'message' => 'Something went wrong when deleting barang'
            ], 500);
        }
    }
}
