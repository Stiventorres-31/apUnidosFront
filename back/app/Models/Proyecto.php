<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Proyecto extends Model
{
    protected $fillable =[
        "codigo_proyecto",
        "nombre_proyecto",
        "departamento_proyecto",
        "ciudad_municipio_proyecto",
        "direccion_proyecto",
        "numero_identificacion",
        "fecha_inicio_proyecto",
        "fecha_final_proyecto",
        "estado",
    ];

    protected function casts():array{
        return[
            "fecha_inicio_proyecto"=>"date",
            "fecha_final_proyecto"=>"date",
        ];
    }

    public function usuarios():BelongsTo{
        return $this->belongsTo(User::class,"numero_identificacion","numero_identificacion");
    }
}
