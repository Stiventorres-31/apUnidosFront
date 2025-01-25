<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Presupuesto extends Model
{
    protected $table = 'presupuestos';

    public $incrementing = false;  // La clave primaria es compuesta

    protected $primaryKey = ['id_inmueble', 'referencia_material', 'codigo_proyecto'];

    protected $fillable = [
        'id_inmueble',
        'referencia_material',
        'costo_material',
        'cantidad_material',
        'codigo_proyecto',
        'estado',
    ];

    protected $casts = [
        'costo_material' => 'decimal:2',
        'cantidad_material' => 'float',
        'estado' => 'string',
    ];

    protected $hidden = [
        'created_at',
        'updated_at'
    ];

    // Relación con Inmueble
    public function inmueble(): BelongsTo
    {
        return $this->belongsTo(Inmueble::class, 'id_inmueble', 'id');
    }

    // Relación con Material
    public function material(): BelongsTo
    {
        return $this->belongsTo(Materiale::class, 'referencia_material', 'referencia_material');
    }

    // Relación con Proyecto
    public function proyecto(): BelongsTo
    {
        return $this->belongsTo(Proyecto::class, 'codigo_proyecto', 'codigo_proyecto');
    }
    public function toArray()
    {
        return [
            'id' => $this->id,
            'id_inmueble' => $this->id_inmueble,
            'referencia_material' => $this->referencia_material,
            'costo_material' => $this->costo_material,
            'cantidad_material' => $this->cantidad_material,
            'estado' => $this->estado,
            "codigo_proyecto"=>$this->codigo_proyecto,
            // 'usuario' => $this->usuario ? $this->usuario->toArray() : null,
            "material"=> $this->material ? $this->material->toArray() : null,
        ];
    }
}
