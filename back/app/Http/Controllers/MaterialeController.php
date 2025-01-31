<?php

namespace App\Http\Controllers;

use App\Models\Asignacione;
use App\Models\Inventario;
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
            'message' => 'Todos los materiales registrados',
            'result' => ["materiale" => $materiale],
        ], 200);
    }

    public function show($referencia_material)
    {
        $validator = Validator::make(["referencia_material" => $referencia_material], [
            "referencia_material" => "required|exists:materiales,referencia_material"
        ]);
        if ($validator->fails()) {
            return response()->json([
                'isError' => true,
                'code' => 422,
                'message' => $validator->errors()->first(),
                'result' => $validator->errors(),
            ], 422);
        }


        $materiale = Materiale::with("inventario")
        ->where("referencia_material", "=", $referencia_material)
        ->first();
        
        return response()->json([
            'isError' => false,
            'code' => 200,
            'message' => "Se ha encontrado el material",
            'result' => ["material" => $materiale],
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
        ]);



        if ($validatorData->fails()) {
            return response()->json([
                'isError' => true,
                'code' => 422,
                'message' => $validatorData->errors()->first(),
                'result' => $validatorData->errors(),
            ], 422);
        }

        $materiale = new Materiale();

        $materiale->referencia_material = strtoupper($request->referencia_material);
        $materiale->nombre_material = strtoupper($request->nombre_material);
        $materiale->numero_identificacion = $request->numero_identificacion;
        $materiale->save();

        $inventario = new Inventario();

        $inventario->referencia_material = $materiale->referencia_material;
        $inventario->consecutivo = 1;
        $inventario->numero_identificacion = $materiale->numero_identificacion;
        $inventario->costo = $request->costo;
        $inventario->cantidad = $request->cantidad;
        $inventario->nit_proveedor = $request->nit_proveedor;
        $inventario->nombre_proveedor = strtoupper($request->nombre_proveedor);
        $inventario->descripcion_proveedor = strtoupper($request->descripcion_proveedor);

        $inventario->save();


        return response()->json([
            'isError' => false,
            "code" => 201,
            'message' => 'Material creado exitosamente.',
            "result" => ['materiale' => $materiale],
        ], 201);
    }

    public function update(Request $request, $referencia_material)
    {

        // return response()->json([
        //     'isError' => true,
        //     'code' => 401,
        //     'message' => "Bloqueado temporalmente",
        //     'errors' => [],
        // ], 401);

        $validatedata = Validator::make($request->all(), [
            "costo" => "required|regex:/^\d{1,10}(\.\d{1,2})?$/",
            "cantidad" => "required|numeric|min:0"
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
        $materiale = Materiale::where('referencia_material', $referencia_material)->first();

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
        ]);

        return response()->json([
            'isError' => false,
            'code' => 200,
            'message' => 'Material actualizado exitosamente.',
            'result' => ['materiale' => $materiale],
        ], 200);
    }

    public function destroy($referencia_material)
    {

        
        $validateData = Validator::make(["referencia_material" => $referencia_material], [
            "referencia_material" => "required|exists:materiales,referencia_material"
        ]);

        if ($validateData->fails()) {
            return response()->json([
                'isError' => true,
                'code' => 422,
                'message' => $validateData->errors()->first(),
                'errors' => $validateData->errors(),
            ], 422);
        }


        $asignacion=Asignacione::where("referencia_material","=",$referencia_material)->first();

        if($asignacion){
            return response()->json([
                'isError' => true,
                'code' => 401,
                'message' => "No se puede eliminar este material",
                'errors' =>[],
            ], 401);
        }

        $materiale = Materiale::where("referencia_material", "=", $referencia_material)->first();


        // Actualizar el estado a "E" (Eliminado o Inactivo)
        $materiale->estado = "E";
        $materiale->save();

        return response()->json([
            'isError' => false,
            'code' => 200,
            'message' => 'Se ha eliminado el material correctamente.',
            'result' => []
        ], 200);
    }
}
