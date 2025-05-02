<?php

namespace App\Http\Controllers;

use App\Models\Kategori;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class KategoriController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'sometimes|string|max:255',
            'sort_by' => 'sometimes|in:id,nama,created_at,active',
            'sort_dir' => 'sometimes|in:asc,desc',
            'per_page' => 'sometimes|integer|min:1|max:100'
        ]);

        $query = Kategori::select(['id', 'nama', 'active']);

        if ($request->filled('nama')) {
            $query->where('nama', 'like', '%' . $request->nama . '%');
        }

        $sortBy = $request->get('sort_by', 'created_at');
        $sortDir = $request->get('sort_dir', 'desc');
        $query->orderBy($sortBy, $sortDir);

        $perPage = $request->get('per_page', 10);
        $kategoris = $query->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'message' => 'Get All Kategori success',
            'data' => $kategoris->items(),
            'meta' => [
                'total' => $kategoris->total(),
                'count' => $kategoris->count(),
                'per_page' => $kategoris->perPage(),
                'current_page' => $kategoris->currentPage(),
                'total_pages' => $kategoris->lastPage()
            ],
            'links' => [
                'first' => $kategoris->url(1),
                'last' => $kategoris->url($kategoris->lastPage()),
                'prev' => $kategoris->previousPageUrl(),
                'next' => $kategoris->nextPageUrl(),
            ],
        ]);
    }

    public function show($id)
    {
        $kategori = Kategori::select(['id', 'nama', 'active'])->find($id);

        return response()->json([
            'status' => $kategori ? 'success' : 'error',
            'message' => $kategori ? 'Get Single Kategori success' : 'Kategori Not Found',
            'data' => $kategori ?? null
        ], 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
        ]);

        $kategori = Kategori::create([
            'nama' => $validated['nama'],
            'active' => 1,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Kategori created successfully',
            'data' => $kategori
        ], 201);
    }

    public function update(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'nama' => 'sometimes|required|string|max:255',
            ]);

            $kategori = Kategori::where('active', 1)->findOrFail($id);
            $kategori->update($validated);

            return response()->json([
                'status' => 'success',
                'message' => 'Kategori updated successfully',
                'data' => $kategori
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error updating kategori: '.$e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Something went wrong when updating kategori'
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $kategori = Kategori::where('active', 1)->findOrFail($id);
            $kategori->update(['active' => 0]);

            return response()->json([
                'status' => 'success',
                'message' => 'Kategori [' . $kategori->nama . '] deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Kategori not found or error during delete'
            ], 500);
        }
    }
}
