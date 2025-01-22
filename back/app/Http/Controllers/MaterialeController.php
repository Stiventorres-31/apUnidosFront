<?php

namespace App\Http\Controllers;

use App\Models\Materiale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;


class MaterialeController extends Controller
{

    public function index()
    {
        $materiale = Materiale::all();

        return response()->json([
            'isError' => false,
            'code' => 200,
            'message' => 'Todos los usuario registrados',
            'result' => ["materiale" => $materiale],
        ], 200);
    }
    public function store(Request $request)
    {

        $validatorData = Validator::make($request->all(), [
            "referencia_material" => "required|unique:materiales|max:10",
            "nombre_material" => "required|unique:materiales|min:6",
            "numero_identificacion" => "required|exists:usuarios,numero_identificacion|max:20|min:6",
            "costo" => "required|regex:/^\d{1,10}(\.\d{1,2})?$/",
            "cantidad" => "required|numeric|min:0",
            "nit_proveedor" => "required|min:6",
            "nombre_proveedor" => "required|min:6",
            "descripcion_proveedor" => "required|min:6",
            "estado" => "string|size:1"
        ]);


        if ($validatorData->fails()) {
            return response()->json([
                'isError' => true,
                'code' => 422,
                'message' => 'Verificar la información',
                'result' => $validatorData->errors(),
            ], 422);
        }

        $materiale = new Materiale();

        $materiale->referencia_material = $request->referencia_material;
        $materiale->nombre_material = $request->nombre_material;
        $materiale->numero_identificacion = $request->numero_identificacion;
        $materiale->costo = $request->costo;
        $materiale->cantidad = $request->cantidad;
        $materiale->nit_proveedor = $request->nit_proveedor;
        $materiale->nombre_proveedor = $request->nombre_proveedor;
        $materiale->descripcion_proveedor = $request->descripcion_proveedor;

        $materiale->save();


        return response()->json([
            'isError' => false,
            "code" => 201,
            'message' => 'Material creado exitosamente.',
            "result" => ['materiale' => $materiale],
        ], 201);
    }

    public function update(Request $request, $referencia)
    {
        $validatedata = Validator::make($request->all(), [



            "costo" => "required|regex:/^\d{1,10}(\.\d{1,2})?$/",
            "cantidad" => "required|numeric|min:0",
            "nit_proveedor" => "required|min:6",
            "nombre_proveedor" => "required|min:6",
            "descripcion_proveedor" => "required|min:6",
        ]);
        // Si la validación falla, devolver una respuesta de error 422
        if ($validatedata->fails()) {
            return response()->json([
                'isError' => true,
                'code' => 422,
                'message' => 'Verificar la información ingresada',
                'errors' => $validatedata->errors(),
            ], 422);
        }

        // Buscar el material por referencia
        $materiale = Materiale::where('referencia_material', $referencia)->first();

        // Verificar si el material existe
        if (!$materiale) {
            return response()->json([
                'isError' => true,
                'code' => 404,
                'message' => 'Material no encontrado',
                'result' => [],
            ], 404);
        }

        // Actualizar los datos del material
        $materiale->update([


            'costo' => $request->costo,
            'cantidad' => $request->cantidad,
            'nit_proveedor' => $request->nit_proveedor,
            'nombre_proveedor' => $request->nombre_proveedor,
            'descripcion_proveedor' => $request->descripcion_proveedor,
        ]);

        return response()->json([
            'isError' => false,
            'code' => 200,
            'message' => 'Material actualizado exitosamente.',
            'result' => ['materiale' => $materiale],
        ], 200);
    }

    public function delete(Request $request)
    {
         // Validar los datos de entrada
    $validateData = Validator::make($request->all(), [
        "referencia_material" => "required|exists:materiales,referencia_material"
    ]);

    if ($validateData->fails()) {
        return response()->json([
            'isError' => true,
            'code' => 422,
            'message' => 'Verificar la información ingresada',
            'errors' => $validateData->errors(),
        ], 422);
    }

    // Buscar el material utilizando referencia como clave primaria
    $materiale = Materiale::find($request->referencia_material);

    // Verificar si el material existe (por seguridad)
    if (!$materiale) {
        return response()->json([
            'isError' => true,
            'code' => 404,
            'message' => 'Material no encontrado.',
        ], 404);
    }

    // Actualizar el estado a "E" (Eliminado o Inactivo)
    $materiale->estado = "E";
    $materiale->save();

    return response()->json([
        'isError' => false,
        'code' => 200,
        'message' => 'Se ha eliminado el material correctamente.',
        'result' => [
            "materiale"=>$materiale
        ],
    ], 200);
    }
}
