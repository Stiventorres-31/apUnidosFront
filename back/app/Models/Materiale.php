<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Materiale extends Model
{
    protected $primaryKey ="referencia_material";
    protected $fillable =[
        "referencia_material",
        "nombre_material",
        "numero_identificacion",
        "costo",
        "cantidad",
        "nit_proveedor",
        "nombre_proveedor",
        "descripcion_proveedor",
        "estado"
    ];
    protected $hidden = [
        'updated_at',
        'created_at'
    ];
    protected function casts(){
        return [
            "estado"=>"string"
        ];
    }
    public function usuarios():BelongsTo{
        return $this->belongsTo(User::class,"numero_identificacion","numero_identificacion");
    }
}
