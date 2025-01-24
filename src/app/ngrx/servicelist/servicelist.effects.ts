import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { ServicesService } from 'src/app/services/servicelist/servicelist.service';
import { ServicesActions } from './servicelsit.actions';


@Injectable()
export class ServicesEffects {
  constructor(private actions$: Actions, private servicesService: ServicesService) {}

  // ✅ Load all services
  loadServices$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServicesActions.loadServices),
      mergeMap(() =>
        this.servicesService.getServices().pipe(
          map((servicesResponse) =>
            ServicesActions.loadServicesSuccess({ servicesResponse })
          ),
          catchError((error) =>
            of(ServicesActions.loadServicesFailure({ error: error.message }))
          )
        )
      )
    )
  );

  // ✅ Load service by ID
  loadServiceById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServicesActions.loadServiceById),
      mergeMap(({ id }) =>
        this.servicesService.getServiceById(id).pipe(
          map((serviceResponse) =>
            ServicesActions.loadServiceByIdSuccess({ serviceResponse })
          ),
          catchError((error) =>
            of(ServicesActions.loadServiceByIdFailure({ error: error.message }))
          )
        )
      )
    )
  );

  // ✅ Create a service
  createService$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServicesActions.createService),
      mergeMap(({ serviceData }) =>
        this.servicesService.createService(serviceData).pipe(
          map((serviceResponse) =>
            ServicesActions.createServiceSuccess({ serviceResponse })
          ),
          catchError((error) =>
            of(ServicesActions.createServiceFailure({ error: error.message }))
          )
        )
      )
    )
  );

  // ✅ Update a service
  updateService$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServicesActions.updateService),
      mergeMap(({ id, updateData }) =>
        this.servicesService.updateService(id, updateData).pipe(
          map((serviceResponse) =>
            ServicesActions.updateServiceSuccess({ serviceResponse })
          ),
          catchError((error) =>
            of(ServicesActions.updateServiceFailure({ error: error.message }))
          )
        )
      )
    )
  );

  // ✅ Delete a service
  deleteService$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ServicesActions.deleteService),
      mergeMap(({ id }) =>
        this.servicesService.deleteService(id).pipe(
          map(() =>
            ServicesActions.deleteServiceSuccess({ message: 'Service deleted successfully.' })
          ),
          catchError((error) =>
            of(ServicesActions.deleteServiceFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
