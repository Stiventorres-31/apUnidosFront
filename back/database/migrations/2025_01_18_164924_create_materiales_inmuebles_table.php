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
        Schema::create('presupuestos', function (Blueprint $table) {
           
            $table->unsignedBigInteger('id');
            $table->string("nombre_inmueble");
            $table->string("referencia_material");
            $table->decimal("costo_material");
            $table->float("cantidad_material");
            $table->string("codigo_proyecto");

            $table->primary(["nombre_inmueble","referencia_material","codigo_proyecto"]);
            $table->index('id');
            $table->foreign("referencia_material")->references("referencia_material")->on("materiales");

            $table->foreign("nombre_inmueble")->references("nombre_inmueble")->on("inmuebles");

            $table->foreign("codigo_proyecto")->references("codigo_proyecto")->on("proyectos");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('materiales_inmuebles');
    }
};
