<?php

namespace App\Http\Controllers;

use App\Models\Proyecto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProyectoController extends Controller
{
    public function store(Request $request)
    {
        $validateData = Validator::make($request->all(), [
            "codigo_proyecto" => "required|exists:proyectos,codigo_proyecto|min:3",
            "departamento_proyecto" => "required|min:6",
            "ciudad_municipio_proyecto" => "required|min:6",
            "direccion_proyecto" => "required|min:6",
            "numero_identificacion" => "required|exists:usuarios,numero_identificacion",
            "fecha_inicio_proyecto" => "required",
            "fecha_final_proyecto" => "required",
        ]);

        if ($validateData->fails()) {
            return response()->json([
                'isError' => true,
                'code' => 422,
                'message' => 'Verificar la información',
                'result' => $validateData->errors(),
            ], 422);
        }

        $proyecto = new Proyecto();
        $proyecto->departamento_proyecto = $request->departamento_proyecto;
        $proyecto->ciudad_municipio_proyecto = $request->ciudad_municipio_proyecto;
        $proyecto->direccion_proyecto = $request->direccion_proyecto;
        $proyecto->numero_identificacion = $request->numero_identificacion;
        $proyecto->fecha_inicio_proyecto = $request->fecha_inicio_proyecto;
        $proyecto->fecha_final_proyecto = $request->fecha_final_proyecto;
       
       
    }
}
