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
            $table->id();
            $table->string("referencia",10)->primary(true)->unique();
            $table->string("nombre_material",255)->unique();
            $table->decimal('costo',10,2);
            $table->float('cantidad');
            $table->string("nit_proveedor");
            $table->string("nombre_proveedor");
            $table->string("descripcion_proveedor");    
            $table->foreignId("numero_identificacion")->on("usuarios")->references("numero_identificacion");
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
