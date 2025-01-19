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
        Schema::create('materiales_inmuebles', function (Blueprint $table) {
            $table->id();
            $table->foreign("inmueble_id")->on("inmuebles")->references("id");
            $table->foreign("referencia")->on("materiales")->references("referencia");
            $table->decimal("costo_material");
            $table->float("cantidad_material");
            $table->foreign("codigo_proyecto")->on("proyectos")->references("codigo_proyecto");
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
