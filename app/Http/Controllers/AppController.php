<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AppController extends Controller
{
    /**
     * Display the main application view
     */
    public function index()
    {
        return view('app');
    }
}