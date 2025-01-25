<?php

namespace App\Http\Controllers;

use App\Models\Materiale;
use App\Models\Presupuesto;
use App\Models\Proyecto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use League\Csv\Reader;
use League\Csv\Statement;

class PresupuestoController extends Controller
{
    public function store(Request $request)
    {
        $validatedData = Validator::make($request->all(), [
            'id_inmueble'         => 'required|exists:inmuebles,id',
            'referencia_material' => 'required|exists:materiales,referencia_material',
            'costo_material'      => 'required|numeric|min:0',
            'cantidad_material'   => 'required|numeric|min:1',
            'codigo_proyecto'     => 'required|exists:proyectos,codigo_proyecto',
            'estado'
        ]);

        if ($validatedData->fails()) {
            return response()->json([
                'isError' => true,
                'code' => 422,
                'message' => 'Verificar la información',
                'result' => $validatedData->errors(),
            ], 422);
        }

        // $presupuesto = Presupuesto::create($validatedData);

        $requestData = $request->all();

        $requestData['id'] = Presupuesto::max('id') + 1;
        $presupuesto = new Presupuesto();

        $dataMaterial = Materiale::where('referencia_material', "=", $request->referencia_material)->first();

        if ($dataMaterial["cantidad"] < $request->cantidad_material) {
            return response()->json([
                'isError' => true,
                'code' => 401,
                'message' => 'No esta disponible la cantidad que requieres',
                'result' => []
            ], 401);
        }
        $presupuesto->id = $requestData['id'];
        $presupuesto->id_inmueble = $request->id_inmueble;
        $presupuesto->referencia_material = strtoupper($request->referencia_material);
        $presupuesto->costo_material = $request->costo_material;
        $presupuesto->cantidad_material = $request->cantidad_material;
        $presupuesto->codigo_proyecto = strtoupper($request->codigo_proyecto);
        $presupuesto->estado = "A";
        $presupuesto->save();

        return response()->json([
            'isError' => false,
            'code' => 201,
            'message' => 'Presupuesto creado exitosamente',
            'result' => ['presupuesto' => $presupuesto]
        ], 201);
    }

    public function destroy(Request $request)
    {
        $validatedData = Validator::make($request->all(), [
            'id_inmueble'         => 'required|exists:inmuebles,id',
            'referencia_material' => 'required|exists:materiales,referencia_material',
            'codigo_proyecto'     => 'required|exists:proyectos,codigo_proyecto',
        ]);

        if ($validatedData->fails()) {
            return response()->json([
                'isError' => true,
                'code' => 422,
                'message' => 'Verificar la información',
                'result' => $validatedData->errors(),
            ], 422);
        }

        $presupuesto = Presupuesto::where([
            'id_inmueble' => $request->id_inmueble,
            'referencia_material' => $request->referencia_material,
            'codigo_proyecto' => $request->codigo_proyecto,
        ])->first();

        if (!$presupuesto) {
            return response()->json([
                'isError' => true,
                'code' => 404,
                'message' => 'Presupuesto no encontrado',
                'result' => [],
            ], 404);
        }

        $presupuesto->estado = "E";
        $presupuesto->save();

        return response()->json([
            'isError' => false,
            'code' => 201,
            'message' => 'Presupuesto creado exitosamente',
            'result' => ['presupuesto' => $presupuesto]
        ], 201);
    }

    public function fileMasivo(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'file' => 'required|file'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'isError' => true,
                'code' => 422,
                'message' => 'Verificar la información',
                'result' => $validator->errors(),
            ], 422);
        }


        $cabecera = [
            "nombre_inmueble",
            "referencia_material",
            "costo_material",
            "cantidad_material",
            "codigo_proyecto"
        ];

        $file = $request->file('file');
        $filePath = $file->getRealPath();

        $archivoCSV = Reader::createFromPath($filePath,"r");
        $archivoCSV->setDelimiter(';');;
        $archivoCSV->setHeaderOffset(0); //obtenemos la cabecera


        $archivoCabecera = $archivoCSV->getHeader();
        // return response()->json([
        //     "message"=>$archivoCabecera
        // ]);

        if ($archivoCabecera !== $cabecera) {
            return response()->json([
                'isError' => true,
                'code' => 400,
                'message' => 'El archivo no tiene la estructura requerida',
                'result' => [],
            ], 400);
        }

        $archivoDatos = $archivoCSV->getRecords();
        $datosPresupuestos = [];


        foreach ($archivoDatos as $value) {
            $validatorDato = Validator::make($value, [
                "nombre_inmueble" => "required|unique:inmuebles,nombre_inmueble",
                "referencia_material" => "required|exists:materiales,referencia_material",
                "costo_material" => "nullable",
                "cantidad_material" => "required|numeric",
                "codigo_proyecto" => "required|exists:proyectos,codigo_proyecto"
            ]);
            if ($validatorDato->fails()) {
                return response()->json([
                    'isError' => true,
                    'code' => 422,
                    'message' => 'Verificar la información que desea registrar',
                    'result' => $validatorDato->errors(),
                ], 422);
            }

            $material = Materiale::where("referencia_material", "=", $value["referencia_material"])->first();
           
            // $proyecto = Proyecto::where("codigo_proyecto","=","codigo_proyecto");

            $datosPresupuestos[] = [
                "id_inmueble"=>1,
                "referencia_material"=>$material->nombre_material,
                "costo_material"=>$material->costo,
                "cantidad_material"=>$value["cantidad_material"],
                "codigo_proyecto"=>strtoupper($value["codigo_proyecto"]),
                "estado" => "A"
            ];


        }
        return response()->json([
            'isError' => false,
            'code' => 200,
            'message' => 'Verificar la información que desea registrar',
            'result' => ["presupuesto"=>$datosPresupuestos],
        ], 200);
    }
}
