import { Component, OnInit, AfterViewInit, Renderer, ElementRef,ViewEncapsulation } from '@angular/core';
import { NgbModalRef,NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';
import { Account, LoginModalService, Principal } from '../shared';
import { Router } from '@angular/router';
import { LoginService } from '../shared/login/login.service';
import { StateStorageService } from '../shared/auth/state-storage.service';



@Component({
    selector: 'jhi-home',
    templateUrl: './home.component.html',
	encapsulation: ViewEncapsulation.None,
    styleUrls: [
        'home.css'
    ]

})
export class HomeComponent implements OnInit,AfterViewInit {

    account: Account;
    modalRef: NgbModalRef;
    authenticationError: boolean;
    password: string;
    rememberMe: boolean;
    username: string;
    credentials: any;

    constructor(
        private principal: Principal,
        private loginModalService: LoginModalService,
        private eventManager: JhiEventManager,
            private loginService: LoginService,
            private stateStorageService: StateStorageService,
            private elementRef: ElementRef,
            private renderer: Renderer,
            private router: Router,
            //public activeModal: NgbActiveModal
    ) {
            this.credentials = {};
    }

    ngOnInit() {
        this.principal.identity().then((account) => {
            this.account = account;
        });
        this.registerAuthenticationSuccess();
    }

    registerAuthenticationSuccess() {
        this.eventManager.subscribe('authenticationSuccess', (message) => {
            this.principal.identity().then((account) => {
                this.account = account;
            });
        });
    }

    isAuthenticated() {
        return this.principal.isAuthenticated();
    }

    ngAfterViewInit() {
            this.renderer.invokeElementMethod(this.elementRef.nativeElement.querySelector('#username'), 'focus', []);
        }

        cancel() {
            this.credentials = {
                username: null,
                password: null,
                rememberMe: true
            };
            this.authenticationError = false;
        }

        login() {
            this.loginService.login({
                username: this.username,
                password: this.password,
                rememberMe: this.rememberMe
            }).then(() => {
                this.authenticationError = false;
                //this.activeModal.dismiss('login success');
                if (this.router.url === '/register' || (/^\/activate\//.test(this.router.url)) ||
                    (/^\/reset\//.test(this.router.url))) {
                    this.router.navigate(['']);
                }

                this.eventManager.broadcast({
                    name: 'authenticationSuccess',
                    content: 'Sending Authentication Success'
                });
                 this.router.navigate(['/apps']);
            }).catch(() => {
                this.authenticationError = true;
            });
        }

        register() {
            this.router.navigate(['/register']);
        }

        requestResetPassword() {
            this.router.navigate(['/reset', 'request']);
        }


}
