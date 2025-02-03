<?php

namespace App\Http\Controllers;

use App\Models\Proyecto;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use League\Csv\Writer;

class ProyectoController extends Controller
{
    public function index()
    {
        $proyectos = Proyecto::all();

        return response()->json([
            'isError' => true,
            "code"=>200,
            'message' => 'Lista de proyectos obtenida con éxito',
            'result' => ["proyecto" => $proyectos]
        ], 200);
    }
    public function store(Request $request)
    {
        $validateData = Validator::make($request->all(), [
            "codigo_proyecto" => "required|unique:proyectos,codigo_proyecto|min:3",
            "departamento_proyecto" => "required|min:6",
            "ciudad_municipio_proyecto" => "required|min:6",
            "direccion_proyecto" => "required|min:6",

            "fecha_inicio_proyecto" => "required|date_format:Y-m-d",
            "fecha_final_proyecto" => "required|date_format:Y-m-d|after:fecha_inicio_proyecto"
        ]);

        if ($validateData->fails()) {
            return response()->json([
                'isError' => true,
                'code' => 422,
                'message' =>  $validateData->errors()->first(),
                'result' => $validateData->errors(),
            ], 422);
        }

        $proyecto = new Proyecto();
        $proyecto->codigo_proyecto = strtoupper($request->codigo_proyecto);
        $proyecto->departamento_proyecto = strtoupper($request->departamento_proyecto);
        $proyecto->ciudad_municipio_proyecto = strtoupper($request->ciudad_municipio_proyecto);
        $proyecto->direccion_proyecto = strtoupper($request->direccion_proyecto);
        $proyecto->numero_identificacion = Auth::user()->numero_identificacion;
        $proyecto->fecha_inicio_proyecto = $request->fecha_inicio_proyecto;
        $proyecto->fecha_final_proyecto = $request->fecha_final_proyecto;
        // $proyecto->fecha_inicio_proyecto = Carbon::parse("d/m/Y", $request->fecha_inicio_proyecto)->format("Y-m-d");
        // $proyecto->fecha_final_proyecto = Carbon::parse("d/m/Y", $request->fecha_final_proyecto)->format("Y-m-d");
        $proyecto->estado = "A";
        $proyecto->save();

        return response()->json([
            'isError' => false,
            'code' => 201,
            'message' => 'Se ha creado con exito',
            'result' => [
                "proyecto" => $proyecto
            ]
        ], 201);
    }
    public function show($codigo_proyecto)
    {
        $proyecto = Proyecto::with('inmuebles.presupuestos')->find($codigo_proyecto);

        if (!$proyecto) {
            return response()->json([
                'isError' => true,
                'code' => 404,
                'message' => 'Proyecto no encontrado',
                'result' => [],
            ], 404);
        }

        return response()->json([
            'isError' => false,
            'code' => 200,
            'message' => 'Proyecto obtenido',
            'result' => ["proyecto" => $proyecto],
        ], 200);
    }

    public function update(Request $request, $codigo_proyecto)
    {
        $proyecto = Proyecto::find($codigo_proyecto);

        if (!$proyecto) {
            return response()->json([
                'isError' => true,
                'code' => 404,
                'message' => 'Proyecto no encontrado',
                'result' => [],
            ], 404);
        }
        if ($proyecto->estado === 'F') {
            return response()->json([
                'isError' => true,
                'code' => 403,
                'message' => 'Este proyecto no se puede actualizar',
                'result' => [],
            ], 403); // Código 403 para indicar acción prohibida
        }

        $validator = Validator::make($request->all(), [

            'departamento_proyecto' => 'sometimes|min:6',
            'ciudad_municipio_proyecto' => 'sometimes|min:6',
            'direccion_proyecto' => 'sometimes|min:6',

            'fecha_inicio_proyecto' => 'sometimes|date_format:d/m/Y',
            'fecha_final_proyecto' => 'sometimes|date_format:d/m/Y|after:fecha_inicio_proyecto',

        ]);

        if ($validator->fails()) {
            return response()->json([

                'isError' => true,
                'code' => 403,
                'message' => 'Este proyecto no se puede actualizar',
                'result' => $validator->errors()
            ], 403);
        }



        $proyecto->departamento_proyecto = strtoupper($request->departamento_proyecto);
        $proyecto->ciudad_municipio_proyecto = strtoupper($request->ciudad_municipio_proyecto);
        $proyecto->direccion_proyecto = strtoupper($request->direccion_proyecto);

        $proyecto->fecha_inicio_proyecto = Carbon::createFromFormat("d/m/Y", $request->fecha_inicio_proyecto)->format("Y-m-d");
        $proyecto->fecha_final_proyecto = Carbon::createFromFormat("d/m/Y", $request->fecha_final_proyecto)->format("Y-m-d");

        $proyecto->save();

        return response()->json([
            'isError' => true,
            'code' => 200,
            'message' => 'Se ha actualizado con exto',
            'result' => ["proyecto" => $proyecto]
        ], 200);
    }

    public function generateCSV($codigo_proyecto)
    {

        $proyecto = Proyecto::with(['inmuebles.presupuestos', "inmuebles.asignaciones"])->find($codigo_proyecto);

        if (!$proyecto) {
            return response()->json([
                'isError' => true,
                'code' => 404,
                'message' => "El proyecto no existe",
                'result' => []
            ], 404);
        }

        return response()->json(
            [
                "presupuesto" => count($proyecto->inmuebles[1]->presupuestos),
                "proyecto" =>    $proyecto
            ]
        );

        $archivoCSV = Writer::createFromString("");
        $archivoCSV->setDelimiter(";");
        $archivoCSV->setOutputBOM(Writer::BOM_UTF8);
        $archivoCSV->insertOne([
            "Código del proyecto",
            "Departamento",
            "Ciudad",
            "Dirección",
            "Fecha de inicio",
            "Fecha de finalización",
            "valorización",
            "Progeso Total"
        ]);

        foreach ($proyecto->inmuebles->presupuestos as $presupuesto) {
            $archivoCSV->insertOne([
                $presupuesto["codigo_proyecto"],
                $presupuesto["nombre_inmueble"],
                $presupuesto["referencia_material"],
                $presupuesto["material"]["nombre_material"],
                $presupuesto["costo_material"],
                $presupuesto["cantidad_material"],

            ]);
        }
        // $headers = [
        //     'Content-Type' => 'text/csv',
        //     'Content-Disposition' => 'attachment; filename="reporte_tipo_inmuebles.csv"',
        // ];
        $csvContent = (string) $archivoCSV;
        $filePath = 'reports/reporte_presupuesto.csv';
        Storage::put($filePath, $csvContent);
        return response()->json([
            'message' => 'El reporte se ha generado y guardado correctamente.',
            'path' => $filePath, // Puedes devolver la ruta del archivo si es necesario
        ], 201);
    }

    public function destroy(Request $request)
    {
        $validator = Validator::make($request->all(), [
            "codigo_proyecto" => "required|exists:proyectos,codigo_proyecto|min:4"
        ]);
        $proyecto = Proyecto::find($request->codigo_proyecto);

        if (!$proyecto) {
            return response()->json([
                'isError' => true,
                'code' => 404,
                'message' => 'Proyecto no encontrado',
                'result' => [],
            ], 404);
        }
        if ($proyecto->estado === 'F') {
            return response()->json([
                'isError' => true,
                'code' => 403,
                'message' => 'Este proyecto no se puede eliminar',
                'result' => [],
            ], 403);
        }

        $proyecto->update(["estado" => "E"]);
        return response()->json([
            'isError' => false,
            'code' => 200,
            'message' => 'Se ha eliminado con exito',
            'result' => []
        ], 200);
    }
}
