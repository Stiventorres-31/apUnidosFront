<?php

namespace App\Http\Controllers;

use App\Models\Asignacione;
use App\Models\Materiale;
use App\Models\Presupuesto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AsignacioneController extends Controller
{
    public function store(Request $request)
    {
        $validatedData = Validator::make($request->all(), [
            'numero_identificacion' => 'required|string|max:20|exists:usuarios,numero_identificacion',
            'referencia_material'  => 'required|string|max:10|exists:materiales,referencia_material',
            'id_inmueble'          => 'required|integer|exists:inmuebles,id',
            'codigo_proyecto'      => 'required|string|max:255|exists:proyectos,codigo_proyecto',
            'cantidad_material'    => 'required|numeric',
            'costo_material'       => 'required|numeric',
        ]);

        if ($validatedData->fails()) {
            return response()->json([
                'isError' => true,
                'code' => 422,
                'message' => 'Verificar la información',
                'result' => $validatedData->errors(),
            ], 422);
        }

        $requestData = $request->all();

        // Obtener el próximo ID incrementado
        $requestData['id'] = Asignacione::max('id') + 1;

        // Obtener datos del material
        $dataMaterial = Materiale::where('referencia_material', $request->referencia_material)->first();
        if (!$dataMaterial) {
            return response()->json([
                'isError' => true,
                'code' => 404,
                'message' => 'Material no encontrado',
                'result' => []
            ], 404);
        }

        // Obtener datos del presupuesto
        $dataPresupuesto = Presupuesto::where([
            'id_inmueble' => $request->id_inmueble,
            'referencia_material' => $request->referencia_material,
            'codigo_proyecto' => $request->codigo_proyecto,
        ])->first();

        if (!$dataPresupuesto) {
            return response()->json([
                'isError' => true,
                'code' => 404,
                'message' => 'Presupuesto no encontrado',
                'result' => []
            ], 404);
        }

        // Validar cantidad de material disponible
        if ($dataMaterial->cantidad < $request->cantidad_material) {
            return response()->json([
                'isError' => true,
                'code' => 401,
                'message' => 'No está disponible la cantidad que requieres',
                'result' => []
            ], 401);
        }

        // Validar si la cantidad sobrepasa el presupuesto
        if ($dataPresupuesto->cantidad_material < $request->cantidad_material) {
            return response()->json([
                'isError' => true,
                'code' => 401,
                'message' => 'La cantidad sobrepasa el presupuesto',
                'result' => []
            ], 401);
        }

        // Crear asignación
        $asignacion = new Asignacione();
        $asignacion->id = $requestData['id'];
        $asignacion->numero_identificacion = $request->numero_identificacion;
        $asignacion->referencia_material = strtoupper($request->referencia_material);
        $asignacion->id_inmueble = $request->id_inmueble;
        $asignacion->codigo_proyecto = strtoupper($request->codigo_proyecto);
        $asignacion->cantidad_material = $request->cantidad_material;
        $asignacion->costo_material = $request->costo_material;
        $asignacion->estado = "A";
        $asignacion->save();

        // Actualizar la cantidad de material disponible
        $dataMaterial->cantidad = $dataMaterial->cantidad - $request->cantidad_material;
        $dataMaterial->save();

        return response()->json([
            'isError'  => false,
            'code'     => 201,
            'message'  => 'Asignación creada exitosamente',
            'result'   => ['asignacion' => $asignacion]
        ], 201);
    }
}
