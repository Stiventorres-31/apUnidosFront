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
        Schema::create('materiales', function (Blueprint $table) {

            $table->string("referencia_material",10);
            $table->string("nombre_material",255);
            $table->string("numero_identificacion",20);
            $table->decimal('costo',10,2);
            $table->float('cantidad');
            $table->string("nit_proveedor");
            $table->string("nombre_proveedor");
            $table->string("descripcion_proveedor");

          

            $table->primary(["referencia_material","nombre_material"]);
            $table->foreign("numero_identificacion")->references("numero_identificacion")->on("usuarios");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('materiales');
    }
};
