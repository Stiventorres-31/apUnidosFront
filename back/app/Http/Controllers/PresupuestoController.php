<?php

namespace App\Http\Controllers;

use App\Models\Inmueble;
use App\Models\Inventario;
use App\Models\Materiale;
use App\Models\Presupuesto;
use App\Models\TipoInmueble;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use League\Csv\Reader;

class PresupuestoController extends Controller
{
    // public function store(Request $request)
    // {
    //     $validatedData = Validator::make($request->all(), [
    //         'nombre_inmueble'         => 'required|exists:inmuebles,nombre_inmueble',
    //         'referencia_material' => 'required|exists:materiales,referencia_material',
    //         'costo_material'      => 'required|numeric|min:1',
    //         'cantidad_material'   => 'required|numeric|min:1',
    //         'codigo_proyecto'     => 'required|exists:proyectos,codigo_proyecto',

    //     ]);

    //     if ($validatedData->fails()) {
    //         return response()->json([
    //             'isError' => true,
    //             'code' => 422,
    //             'message' => 'Verificar la información',
    //             'result' => $validatedData->errors(),
    //         ], 422);
    //     }

    //     // $presupuesto = Presupuesto::create($validatedData);

    //     $requestData = $request->all();


    //     $presupuesto = new Presupuesto();

    //     $dataMaterial = Materiale::where('referencia_material', "=", $request->referencia_material)->first();



    //     $presupuesto->nombre_inmueble = $request->nombre_inmueble;
    //     $presupuesto->referencia_material = $dataMaterial->referencia_material;
    //     $presupuesto->costo_material = $dataMaterial->costo;
    //     $presupuesto->cantidad_material = $request->cantidad;
    //     $presupuesto->codigo_proyecto = strtoupper($request->codigo_proyecto);

    //     $presupuesto->save();

    //     return response()->json([
    //         'isError' => false,
    //         'code' => 201,
    //         'message' => 'Presupuesto creado exitosamente',
    //         'result' => ['presupuesto' => $presupuesto]
    //     ], 201);
    // }
    public function store(Request $request)
    {


        $validatedData = Validator::make($request->all(), [
            'nombre_inmueble' => 'required|exists:inmuebles,nombre_inmueble',
            'codigo_proyecto' => 'required|exists:proyectos,codigo_proyecto',
            'materiales' => "required|array",

        ]);

        if ($validatedData->fails()) {
            return response()->json([
                'isError' => true,
                'code' => 422,
                'message' => $validatedData->errors()->first(),
                'result' => $validatedData->errors(),
            ], 422);
        }

        $numero_identificacion = Auth::user()->numero_identificacion;
        $templatePresupuesto = [];

        foreach ($request->materiales as $material) {
            $validatedData = Validator::make($material, [
                'referencia_material' => 'required|exists:materiales,referencia_material',
                'costo_material'      => 'required|numeric|min:1',
                'consecutivo' => "required|numeric|exists:inventarios,consecutivo",
                'cantidad_material'   => 'required|numeric|min:1',
            ]);

            if ($validatedData->fails()) {
                return response()->json([
                    'isError' => true,
                    'code' => 422,
                    'message' => $validatedData->errors()->first(),
                    'result' => $validatedData->errors(),
                ], 422);
            }

            $dataMaterial = Materiale::where('referencia_material', "=", strtoupper($material["referencia_material"]))->first();

            

            if ($dataMaterial->estado !== "A" || !$dataMaterial) {
                return response()->json([
                    'isError' => true,
                    'code' => 422,
                    'message' => "Este material no existe",
                    'result' => [],
                ], 422);
            }

            $inventario = Inventario::where("referencia_material", "=", $dataMaterial->referencia_material)
                ->where("consecutivo", "=", $material["consecutivo"])->first();
                

            $templatePresupuesto[] = [
                "nombre_inmueble" => strtoupper($request->nombre_inmueble),
                "codigo_proyecto" => strtoupper($request->codigo_proyecto),
                "referencia_material" => $dataMaterial->referencia_material,
                "consecutivo" => $inventario->consecutivo,
                "costo_material" => $inventario->costo,
                "cantidad_material" => $inventario->cantidad,
                "subtotal" => ($inventario->costo * $inventario->cantidad),

                "numero_identificacion" => $numero_identificacion
            ];
        }

        // return response()->json($templatePresupuesto);
        Presupuesto::insert($templatePresupuesto);

        return response()->json([
            'isError' => false,
            'code' => 201,
            'message' => 'Presupuesto creado exitosamente',
            'result' => []
        ], 201);
    }

    public function destroy(Request $request)
    {


        $validatedData = Validator::make($request->all(), [
            'nombre_inmueble'         => 'required|integer|exists:presupuestos,nombre_inmueble',
            'referencia_material' => 'required|string|exists:presupuestos,referencia_material',
            'codigo_proyecto'     => 'required|string|exists:presupuestos,codigo_proyecto',
        ]);

        if ($validatedData->fails()) {
            return response()->json([
                'isError' => true,
                'code' => 422,
                'message' => $validatedData->errors()->first(),
                'result' => $validatedData->errors(),
            ], 422);
        }

        $presupuesto = Presupuesto::where([
            'nombre_inmueble' => $request->nombre_inmueble,
            'referencia_material' => $request->referencia_material,
            'codigo_proyecto' => $request->codigo_proyecto,
        ])->delete();

        if (!$presupuesto) {
            return response()->json([
                'isError' => true,
                'code' => 404,
                'message' => 'Presupuesto no encontrado',
                'result' => [],
            ], 404);
        }


        // $presupuesto->delete(); 



        return response()->json([
            'isError' => false,
            'code' => 200,
            'message' => 'Presupuesto eliminado exitosamente',
            'result' => []
        ], 200);
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
                'message' => $validator->errors()->first(),
                'result' => $validator->errors(),
            ], 422);
        }


        $cabecera = [
            "nombre_inmueble",
            "tipo_inmueble",
            "referencia_material",
            "costo_material",
            "cantidad_material",
            "codigo_proyecto"
        ];

        $file = $request->file('file');
        $filePath = $file->getRealPath();

        $archivoCSV = Reader::createFromPath($filePath, "r");
        $archivoCSV->setDelimiter(';');;
        $archivoCSV->setHeaderOffset(0); //obtenemos la cabecera


        $archivoCabecera = $archivoCSV->getHeader();


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
                "nombre_inmueble" => "required",
                "tipo_inmueble" => [
                    "required",
                    function ($attribute, $value, $fail) {
                        // Convertir a mayúsculas antes de la validación
                        $tipo = strtoupper($value);
                        if (!DB::table('tipo_inmuebles')->where('nombre_tipo_inmueble', $tipo)->exists()) {
                            $fail("El tipo de inmueble '{$value}' no existe.");
                        }
                    }
                ],
                "referencia_material" => "required|exists:materiales,referencia_material",
                "costo_material" => "nullable",
                "cantidad_material" => "required|numeric",
                "codigo_proyecto" => "required|exists:proyectos,codigo_proyecto"
            ]);
            if ($validatorDato->fails()) {
                return response()->json([
                    'isError' => true,
                    'code' => 422,
                    'message' => $validator->errors()->first(),
                    'result' => $validatorDato->errors(),
                ], 422);
            }

            $material = Materiale::where("referencia_material", "=", $value["referencia_material"])->first();
            $tipo_inmueble = TipoInmueble::where("nombre_tipo_inmueble", "=", strtoupper($value["tipo_inmueble"]))->first();

            $inmueble = Inmueble::firstOrCreate([
                "nombre_inmueble" => strtoupper($value["nombre_inmueble"]),
                "codigo_proyecto" => strtoupper($value["codigo_proyecto"]),
                "tipo_inmueble" => (int) $tipo_inmueble->id,
                "numero_identificacion" => Auth::user()->numero_identificacion,
            ]);


            // $proyecto = Proyecto::where("codigo_proyecto","=","codigo_proyecto");

            $exists = Presupuesto::where('nombre_inmueble', '=', $inmueble->nombre_inmueble)
                ->where('referencia_material', '=',  $material->referencia_material)
                ->where('codigo_proyecto', '=',  strtoupper($value["codigo_proyecto"]))
                ->exists();

            if (!$exists) {
                $datosPresupuestos[] = [

                    "nombre_inmueble" => $inmueble->nombre_inmueble,
                    "referencia_material" => $material->referencia_material,
                    "costo_material" => $material->costo,
                    "cantidad_material" => $value["cantidad_material"],
                    "codigo_proyecto" => strtoupper($value["codigo_proyecto"]),
                    "numero_identificacion" => auth::user()->numero_identificacion
                ];
            }
        }

        Presupuesto::insert($datosPresupuestos);

        return response()->json([
            'isError' => false,
            'code' => 200,
            'message' => 'Se ha finalizado el cargue',
            'result' => ["presupuesto" => $datosPresupuestos],
        ], 200);
    }
}
