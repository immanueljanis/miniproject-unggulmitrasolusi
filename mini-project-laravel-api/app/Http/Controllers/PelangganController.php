<?php

namespace App\Http\Controllers;

use App\Models\Pelanggan;
use Illuminate\Http\Request;

class PelangganController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'sometimes|string|max:100',
            'id_pelanggan' => 'sometimes|string|max:100',
            'domisili' => 'sometimes|string|max:50',
            'jenis_kelamin' => 'sometimes|in:pria,wanita',
            'sort_by' => 'sometimes|in:id_pelanggan,nama,domisili,created_at,jenis_kelamin',
            'sort_dir' => 'sometimes|in:asc,desc',
            'per_page' => 'sometimes|integer|min:1|max:100'
        ]);
        
        // Start with base query
        $query = Pelanggan::where('active', 1)->select([
            'id',
            'id_pelanggan',
            'nama',
            'domisili',
            'jenis_kelamin',
            'active'
        ]);
        
        // FILTERING
        if ($request->has('nama')) {
            $query->where('nama', 'like', '%'.$request->nama.'%');
        }

        if ($request->has('id_pelanggan')) {
            $query->where('id_pelanggan', 'like', '%'.$request->id_pelanggan.'%');
        }
        
        if ($request->has('domisili')) {
            $query->where('domisili', 'like', '%'.$request->domisili.'%');
        }
        
        if ($request->has('jenis_kelamin')) {
            $query->where('jenis_kelamin', $request->jenis_kelamin);
        }

        $sortField = $request->get('sort_by', 'created_at');
        $sortDirection = $request->get('sort_dir', 'desc'); 
        
        $query->orderBy($sortField, $sortDirection);

        $perPage = $request->get('per_page', 10); 
        $pelanggans = $query->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'message'=> 'Get All Pelanggan success',
            'data' => $pelanggans->items(),
            'meta' => [
                'total' => $pelanggans->total(),
                'count' => $pelanggans->count(),
                'per_page' => $pelanggans->perPage(),
                'current_page' => $pelanggans->currentPage(),
                'total_pages' => $pelanggans->lastPage()
            ],
            'links' => [
                'first' => $pelanggans->url(1),
                'last' => $pelanggans->url($pelanggans->lastPage()),
                'prev' => $pelanggans->previousPageUrl(),
                'next' => $pelanggans->nextPageUrl(),
            ],
        ], 200);
    }

    public function show($id)
    {
        $pelanggan = Pelanggan::where('active', 1)->select([
            'id_pelanggan',
            'nama', 
            'domisili',
            'jenis_kelamin',
            'active'
        ])->find($id);

        return response()->json([
            'status' => $pelanggan ? 'success' : 'error',
            'message'=> $pelanggan ? 'Get Single Pelanggan success' : 'Pelanggan Not Found',
            'data' => $pelanggan ? $pelanggan : null
        ], 200);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'nama' => 'required|string|max:255',
                'domisili' => 'required|string|max:255',
                'jenis_kelamin' => 'required|in:pria,wanita'
            ]);

            $pelanggan = Pelanggan::create($validated);

            return response()->json([
                'status' => 'success',
                'message' => 'Pelanggan created successfully',
                'data' => $pelanggan
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            Log::error('Error creating pelanggan: '.$e->getMessage());

            return response()->json([
                'status' => 'error',
                'message' => 'Something went wrong when creating pelanggan'
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'nama' => 'sometimes|required|string|max:255',
                'domisili' => 'sometimes|required|string|max:255',
                'jenis_kelamin' => 'sometimes|required|in:pria,wanita'
            ]);

            $pelanggan = Pelanggan::where('active', 1)->findOrFail($id);
            $pelanggan->update($validated);

            return response()->json([
                'status' => 'success',
                'message' => 'Pelanggan [' . $pelanggan->id_pelanggan . '] updated successfully',
                'data' => $pelanggan
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $e->errors()
            ], 422);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Pelanggan not found'
            ], 404);

        } catch (\Exception $e) {
            Log::error('Error updating pelanggan: '.$e->getMessage());

            return response()->json([
                'status' => 'error',
                'message' => 'Something went wrong when updating pelanggan'
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $pelanggan = Pelanggan::where('active', 1)->findOrFail($id);
            $pelanggan->update(['active' => 0]);

            return response()->json([
                'status' => 'success',
                'message' => 'Pelanggan [' . $pelanggan->nama . '] deleted successfully'
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Pelanggan not found'
            ], 404);

        } catch (\Exception $e) {
            Log::error('Error deleting pelanggan: '.$e->getMessage());

            return response()->json([
                'status' => 'error',
                'message' => 'Something went wrong when deleting pelanggan'
            ], 500);
        }
    }
}
