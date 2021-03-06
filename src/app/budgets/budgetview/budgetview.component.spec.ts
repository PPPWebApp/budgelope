import { Component, Directive, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatMenuModule, MatTableModule } from '@angular/material';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BudgetviewComponent } from './budgetview.component';
import { BudgetService } from '../budget.service';
import { UserService } from '../../shared/user.service';
import { DragulaService } from 'ng2-dragula';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import * as moment from 'moment';

import { ActivatedRouteStub } from '../../../testing/activate-route-stub';
import { CategoryService } from '../../categories/category.service';

describe('BudgetviewComponent', () => {
  let component: BudgetviewComponent;
  let fixture: ComponentFixture<BudgetviewComponent>;

  let budgetServiceStub;
  let userServiceStub: Partial<UserService>;
  let dragulaServiceStub, categoryServiceStub;
  let activatedRouteStub: ActivatedRouteStub;
  let angularFirestoreServiceStub;
  let angularFireAuthServiceStub;

  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(async(() => {
    activatedRouteStub = new ActivatedRouteStub();
    activatedRouteStub.setParamMap({
      month: '201805'
    });

    angularFireAuthServiceStub = jasmine.createSpyObj('AngularFireAuth', ['authenticate']);
    angularFireAuthServiceStub.authState = of({
      uid: '12345'
    });

    angularFirestoreServiceStub = jasmine.createSpyObj('AngularFirestore', ['doc', 'collection']);
    angularFirestoreServiceStub.doc.and.returnValue({
      valueChanges: function() {
        return of({});
      }
    });

    dragulaServiceStub = jasmine.createSpyObj('DragulaService', ['setOptions', 'find']);
    dragulaServiceStub.dropModel = of({});

    budgetServiceStub = jasmine.createSpyObj('BudgetService', ['getActiveBudget$']);
    budgetServiceStub.getActiveBudget$.and.returnValue(of({
      id: '67890',
      name: 'test budget',
      allocations: {}
    }));
    userServiceStub = {};
    categoryServiceStub = jasmine.createSpyObj('CategoryService', ['getCategories']);

    TestBed.configureTestingModule({
      imports: [MatMenuModule],
      declarations: [BudgetviewComponent],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: AngularFirestore,
          useValue: angularFirestoreServiceStub
        },
        {
          provide: AngularFireAuth,
          useValue: angularFireAuthServiceStub
        },
        {
          provide: BudgetService,
          useValue: budgetServiceStub
        },
        {
          provide: UserService,
          useValue: userServiceStub
        },
        {
          provide: DragulaService,
          useValue: dragulaServiceStub
        },
        {
          provide: ActivatedRoute,
          useValue: activatedRouteStub
        },
        {
          provide: Router,
          useValue: routerSpy
        },
        {
          provide: CategoryService,
          useValue: categoryServiceStub
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    angularFirestoreServiceStub.doc.and.callFake(function(args) {
      if (args === 'users/12345') {
        return {
          valueChanges: function() {
            return of({
              activeBudget: '67890',
              availableBudgets: {
                testBudget: { name: 'TestBudget1' },
                testBudget2: { name: 'TestBudget2' },
                testBudget3: { name: 'TestBudget3' }
              }
            });
          }
        };
      } else if (args === 'budgets/67890') {
        return {
          valueChanges: function() {
            return of({
              allocations: []
            });
          }
        };
      }
    });

    angularFirestoreServiceStub.collection.and.returnValue({
      snapshotChanges: function() {
        return of([]);
      }
    });

    fixture = TestBed.createComponent(BudgetviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create a component', () => {
    expect(component).toBeTruthy();
  });

  it('should load the available budgets in an array of objects', () => {

    expect(component.budgetList.length).toBe(3);
    expect(component.budgetList[0]).toEqual({id: 'testBudget', name: 'TestBudget1'}, 'should equal the correct budget name');
  });

  it('should load the categories for the active budget', () => {
    expect(categoryServiceStub.getCategories).toHaveBeenCalledWith('67890');
  });

  it('should load the active budget details and allocations', () => {
    expect(budgetServiceStub.getActiveBudget$).toHaveBeenCalled();
  });

  it('should get the display month from the month param', () => {
    const displayMonth = moment('20180501').format('MMMM YYYY')
    expect(component.displayMonth).toEqual(displayMonth);
  })
});
