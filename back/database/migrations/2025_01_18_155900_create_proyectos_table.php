<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('proyectos', function (Blueprint $table) {
            $table->id(); // Crea una columna autoincremental como clave primaria (BIGINT UNSIGNED)
            $table->string('codigo_proyecto', 10)->unique(); // Ya es indexado automáticamente por unique()
            $table->string('departamento_proyecto');
            $table->string('ciudad_municipio_proyecto');
            $table->string('direccion_proyecto');
            $table->string('numero_identificacion', 20); // Debe coincidir con la tabla usuarios
            $table->date('fecha_inicio_proyecto');
            $table->date('fecha_final_proyecto');
            
            $table->foreign("numero_identificacion")->references("numero_identificacion")->on("usuarios");

            $table->char('estado', 1)->default('A'); // Estado activo por defecto
            $table->timestamps(); // Crea created_at y updated_at automáticamente
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('proyectos');
    }
};
