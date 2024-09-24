import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(public router:Router,
              public Login:LoginService
  ) {
    this.usuario = Login.usuario;
    console.log(this.usuario)
  }

  public Menu_:any = []
  public empresa = false;
  public compras = false;
  public ventas = false;
  public inventario = false;
  public laboratorio = false;
  public produccion = false;
  public usuario:any;
  public pass = false;

  ngOnInit(): void {
  }

  Menu:boolean = false;
  Solicitud_Material:boolean = false;

  isMenuVisible = false;
  
  showPopUp(){
    this.isMenuVisible = true;
  }

  @HostListener('window:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.usuario') && !target.closest('.popup_menu')) {
      this.isMenuVisible = false;
    }
  }

  cerrarSesion(): void {
      this.Login.logout();
  }

  cambiarContrasena(): void {
    this.pass = true;
  }

  showMenu(){
    this.Menu = true;
  }

  cerrarMenu(){
    this.Menu = false;
  }

  select_menu(n){
    this.Menu_ = [];
    this.Menu_[n] = true;
    this.empresa = false
  }

  showEmpresa(){
    this.empresa = true;
    this.compras = false;
    this.ventas = false;
    this.inventario = false;
    this.laboratorio = false;
    this.produccion = false;

  }
  showCompras(){
    this.compras = true;
    this.empresa = false
    this.ventas = false;
    this.inventario = false;
    this.laboratorio = false;
    this.produccion = false;
  }

  showVentas(){
    this.ventas = true;
    this.compras = false;
    this.empresa = false
    this.inventario = false;
    this.laboratorio = false;
    this.produccion = false;
  }

  showInventario(){
    this.inventario = true;
    this.ventas = false;
    this.compras = false;
    this.empresa = false;
    this.laboratorio = false;
    this.produccion = false;
  }

  ShowLaboratorio(){
    this.laboratorio = true;
    this.inventario = false;
    this.ventas = false;
    this.compras = false;
    this.empresa = false;
    this.produccion = false;
  }

  showProduccion(){
    this.produccion = true;
    this.laboratorio = false;
    this.inventario = false;
    this.ventas = false;
    this.compras = false;
    this.empresa = false;
  }

  cerrar(){
    console.log('close')
    this.pass = false;
  }

}
