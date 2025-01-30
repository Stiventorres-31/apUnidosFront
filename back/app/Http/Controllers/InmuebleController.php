<?php

namespace App\Http\Controllers;

use App\Models\Asignacione;
use App\Models\Inmueble;
use App\Models\Presupuesto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use League\Csv\Writer;

class InmuebleController extends Controller
{
    public function index()
    {
        $inmueble = Inmueble::all();

        if (!$inmueble) {
            return response()->json([
                'isError' => true,
                'code' => 404,
                'message' => 'No hay inmueble registrado',
                'result' => [],
            ], 404);
        }



        return response()->json([
            'isError' => true,
            'code' => 200,
            'message' => 'Todos los inmuebles',
            'result' => ["inmueble" => $inmueble],
        ], 200);
    }
    public function show($id)
    {
        $inmueble = Inmueble::find($id);

        if (!$inmueble) {
            return response()->json([
                'isError' => true,
                'code' => 404,
                'message' => 'El inmueble no encontrado',
                'result' => [],
            ], 404);
        }



        return response()->json([
            'isError' => false,
            'code' => 200,
            'message' => 'Se ha encontrado el inmueble',
            'result' => ["inmueble" => $inmueble],
        ], 200);
    }

    public function generateCSV($id_inmueble) {

        $inmueble = Inmueble::find($id_inmueble);
        
        if(!$inmueble){
            return response()->json([
                'isError' => true,
                'code' => 404,
                'message' => "El inmueble no existe",
                'result' => []
            ], 404);
        }

        $archivoCSV = Writer::createFromString('');
        $archivoCSV->setDelimiter(";");
        $archivoCSV->setOutputBOM(Writer::BOM_UTF8);
        $archivoCSV->insertOne([
            "Código del proyecto",
            "Nombre de inmueble",
            "Referencia del material",
            "Nombre del material",
            "costo del material",
            "Cantidad del material"
        ]);

        foreach ($inmueble->presupuestos as $presupuesto) {
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
        $filePath ='reports/reporte_presupuesto.csv';
        Storage::put($filePath, $csvContent);
        return response()->json([
            'message' => 'El reporte se ha generado y guardado correctamente.',
            'path' => $filePath, // Puedes devolver la ruta del archivo si es necesario
        ], 201);
    }

    public function store(Request $request)
    {

        $validateData = Validator::make($request->all(), [
            "tipo_inmueble" => "required|exists:tipo_inmuebles,id",
            "codigo_proyecto" => "required|exists:proyectos,codigo_proyecto",
            "nombre_inmueble" => "required|unique:inmuebles,nombre_inmueble|max:255"
        ]);


        if ($validateData->fails()) {
            return response()->json([
                'isError' => true,
                'code' => 422,
                'message' => $validateData->errors()->first(),
                'result' => $validateData->errors(),
            ], 422);
        }

        $inmueble = new Inmueble();

        $inmueble->nombre_inmueble = strtoupper($request->nombre_inmueble);
        $inmueble->tipo_inmueble = strtoupper($request->tipo_inmueble);
        $inmueble->codigo_proyecto = strtoupper($request->codigo_proyecto);
        $inmueble->numero_identificacion = Auth::user()->numero_identificacion;
        $inmueble->save();

        return response()->json([
            'isError' => false,
            'code' => 201,
            'message' => 'Se ha creado con exito',
            'result' => ["inmueble" => $inmueble],
        ], 201);
    }

    public function destroy($id)
    {
        $validator = Validator::make(['id' => $id], [
            'id' => 'required|exists:inmuebles,id', // Verifica que exista el ID en la tabla tipo_inmuebles
        ]);

        if ($validator->fails()) {
            return response()->json([
                'isError' => true,
                'code' => 404,
                'message' => $validator->errors()->first(), // Devuelve el primer error
                'result' => $validator->errors()
            ], 404);
        }

        $inmueble = Inmueble::find($id);

        $existePresupuesto = Presupuesto::where('nombre_inmueble', '=', $inmueble->nombre_inmueble)->exists();
        $existeAsignacion = Asignacione::where('nombre_inmueble', '=', $inmueble->nombre_inmueble)->exists();

        if ($inmueble->estado === "F" || $existePresupuesto || $existeAsignacion) {
            return response()->json([
                'isError' => true,
                'code' => 400,
                'message' => "No se puede eliminar este inmueble. Verifica si el inmueble ya fue finalizado o tenga un presupuesto activo", // Devuelve el primer error
                'result' => []
            ], 400);
        }

        $inmueble->estado = "E";

        return response()->json([
            'isError' => false,
            'code' => 200,
            'message' => 'Se ha eliminado con éxito',
            'result' => [],
        ], 200);
    }

    // public function update(Request $request, $id){
    //     $validateData = Validator::make($request->all(), [
    //         "tipo_inmueble" => "required|exists:tipo_inmuebles,id",

    //         "nombre_inmueble" => "required|unique:inmuebles,nombre_inmueble|max:255",
    //         'numero_identificacion' => 'required|string|exists:usuarios,numero_identificacion|max:20',
    //     ]);

    //     if ($validateData->fails()) {
    //         return response()->json([
    //             'isError' => true,
    //             'code' => 422,
    //             'message' => 'Verificar la información',
    //             'result' => $validateData->errors(),
    //         ], 422);
    //     }

    //     $inmueble = new Inmueble();


    //     $inmueble->tipo_inmueble = strtoupper($request->tipo_inmueble);
    //     $inmueble->codigo_proyecto = strtoupper($request->codigo_proyecto);
    //     $inmueble->numero_identificacion = strtoupper($request->numero_identificacion);
    //     $inmueble->save();

    //     return response()->json([
    //         'isError' => false,
    //         'code' => 201,
    //         'message' => 'Se ha creado con exito',
    //         'result' => ["inmueble" => $inmueble],
    //     ], 201);
    // }
}
