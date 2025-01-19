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
        Schema::create('asignaciones', function (Blueprint $table) {
            $table->id();
            $table->foreign('numero_identificacion')->on("usuarios")->references("numero_identificacion");
            $table->foreign('codigo_material')->on("usuarios")->references("codigo_material");
            $table->foreign("inmueble_id")->on("inmuebles")->references("id"); 
            $table->foreign("codigo_proyecto")->on("proyectos")->references("codigo_proyecto");
            $table->float("cantidad_material");
            $table->decimal("costo_material");
            $table->string("estado")->default("Activo");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('asignaciones');
    }
};
