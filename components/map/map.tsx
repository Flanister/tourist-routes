/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, {
  useEffect,
  useRef,
  useState
} from 'react';

import axios from 'axios';

declare global {
  interface Window {
    ymaps: any;
  }
}

type TransportType =
  | 'auto'
  | 'pedestrian'
  | 'masstransit'
  | 'plane';

type RouteItem = {
  id: number;
  from: string;
  to: string;
  distance: string;
  duration: string;
  transport: TransportType;
  favorite?: boolean;
  userId?: string | null;
};

export default function Map() {
  const mapRef = useRef<any>(null);

  const routeRef = useRef<any>(null);

  const currentMarkerRef =
    useRef<any>(null);

  const [loading, setLoading] =
    useState(false);

  const [routes, setRoutes] =
    useState<RouteItem[]>([]);

  const [fromVal, setFromVal] =
    useState('');

  const [toVal, setToVal] =
    useState('');

  const [transport, setTransport] =
    useState<TransportType>('auto');

  const [routeInfo, setRouteInfo] =
    useState<{
      distance: string;
      duration: string;
    } | null>(null);

  const touristSpots = [
  {
    coords: [59.9343, 30.3351],
    title: 'Санкт-Петербург',
    text: 'Невский проспект'
  },
  {
    coords: [55.751244, 37.618423],
    title: 'Москва',
    text: 'Красная площадь'
  },
  {
    coords: [43.5855, 39.7231],
    title: 'Сочи',
    text: 'Черное море'
  },
  {
    coords: [56.8389, 60.6057],
    title: 'Екатеринбург',
    text: 'Урал'
  },
  {
    coords: [55.7961, 49.1064],
    title: 'Казань',
    text: 'Кремль'
  },
  {
    coords: [54.7104, 20.4522],
    title: 'Калининград',
    text: 'Балтика'
  },
  {
    coords: [43.1155, 131.8855],
    title: 'Владивосток',
    text: 'Тихий океан'
  },
  {
    coords: [53.1959, 50.1008],
    title: 'Самара',
    text: 'Волга'
  },
  {
    coords: [56.3269, 44.0059],
    title: 'Нижний Новгород',
    text: 'Стрелка'
  },
  {
    coords: [51.5336, 46.0343],
    title: 'Саратов',
    text: 'Набережная'
  },
  {
    coords: [48.708, 44.5133],
    title: 'Волгоград',
    text: 'Мамаев Курган'
  },
  {
    coords: [55.0084, 82.9357],
    title: 'Новосибирск',
    text: 'Сибирь'
  },
  {
    coords: [52.2869, 104.305],
    title: 'Иркутск',
    text: 'Байкал'
  },
];

  useEffect(() => {
    const saved =
      localStorage.getItem(
        'routes_history'
      );

    if (saved) {
      try {
        setRoutes(JSON.parse(saved));
      } catch {}
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (
        window.ymaps &&
        !mapRef.current
      ) {
        window.ymaps.ready(() => {
          const map =
            new window.ymaps.Map(
              'map-container',
              {
                center: [
                  55.751244,
                  37.618423
                ],

                zoom: 5,

                controls: []
              }
            );

          mapRef.current = map;

          map.controls.add(
            new window.ymaps.control.ZoomControl()
          );

          touristSpots.forEach(
            (spot) => {
              const mark =
                new window.ymaps.Placemark(
                  spot.coords,
                  {
                    balloonContent:
                      `
                      <b>${spot.title}</b>
                      <br/>
                      ${spot.text}
                    `
                  }
                );

              mark.events.add(
                'click',
                () =>
                  handleSpotClick(
                    spot
                  )
              );

              map.geoObjects.add(mark);
            }
          );
        });

        clearInterval(timer);
      }
    }, 300);

    return () =>
      clearInterval(timer);
  }, []);

  const clearRoute = () => {
    if (routeRef.current) {
      try {
        mapRef.current.geoObjects.remove(
          routeRef.current
        );
      } catch {}

      routeRef.current = null;
    }
  };

  const geocode = async (
    query: string
  ): Promise<[number, number]> => {
    if (query.includes(',')) {
      const parts = query
        .split(',')
        .map(Number);

      if (
        !isNaN(parts[0]) &&
        !isNaN(parts[1])
      ) {
        return [
          parts[0],
          parts[1]
        ];
      }
    }

    const res =
      await window.ymaps.geocode(
        query,
        {
          results: 1
        }
      );

    const obj =
      res.geoObjects.get(0);

    if (!obj) {
      throw new Error(
        'Не найдено'
      );
    }

    return obj.geometry.getCoordinates();
  };

  const calcDistance = (
    a: [number, number],
    b: [number, number]
  ) => {
    const R = 6371;

    const dLat =
      ((b[0] - a[0]) *
        Math.PI) /
      180;

    const dLon =
      ((b[1] - a[1]) *
        Math.PI) /
      180;

    const lat1 =
      (a[0] * Math.PI) /
      180;

    const lat2 =
      (b[0] * Math.PI) /
      180;

    const q =
      Math.sin(dLat / 2) *
        Math.sin(dLat / 2) +
      Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c =
      2 *
      Math.atan2(
        Math.sqrt(q),
        Math.sqrt(1 - q)
      );

    return R * c;
  };

  const draw = async (
    from: string,
    to: string
  ) => {
    if (!from || !to) {
      alert('Заполните поля');

      return;
    }

    if (!mapRef.current) return;

    setLoading(true);

    clearRoute();

    try {
      const fromCoord =
        await geocode(from);

      const toCoord =
        await geocode(to);

      const distance =
        calcDistance(
          fromCoord,
          toCoord
        );

      if (transport === 'plane') {
        const line =
          new window.ymaps.Polyline(
            [fromCoord, toCoord],
            {},
            {
              strokeColor:
                '#2563eb',

              strokeWidth: 4,

              strokeStyle:
                'shortdash'
            }
          );

        mapRef.current.geoObjects.add(
          line
        );

        routeRef.current = line;

        mapRef.current.setBounds(
          line.geometry.getBounds(),
          {
            checkZoomRange: true
          }
        );

        setRouteInfo({
          distance: `${Math.round(
            distance
          )} км`,

          duration: `${(
            distance / 800
          ).toFixed(1)} ч`
        });

        setLoading(false);

        return;
      }

      const route =
        new window.ymaps.multiRouter.MultiRoute(
          {
            referencePoints: [
              fromCoord,
              toCoord
            ],

            params: {
              routingMode:
                transport
            }
          },
          {
            boundsAutoApply: true
          }
        );

      mapRef.current.geoObjects.add(
        route
      );

      routeRef.current = route;

      route.model.events.add(
        'requestsuccess',
        () => {
          const active =
            route.getActiveRoute();

          if (!active) return;

          const dist =
            active.properties.get(
              'distance'
            );

          const dur =
            active.properties.get(
              'duration'
            );

          setRouteInfo({
            distance:
              dist?.text ||
              '0 км',

            duration:
              dur?.text ||
              '0 мин'
          });

          setLoading(false);
        }
      );

      route.model.events.add(
        'requestfail',
        () => {
          alert(
            'Маршрут не найден'
          );

          setLoading(false);
        }
      );
    } catch (e) {
      console.error(e);

      alert(
        'Ошибка маршрута'
      );

      setLoading(false);
    }
  };

  const save = async (e: any) => {
  e.preventDefault();
  if (!routeInfo) { alert('Сначала построй маршрут'); return; }
  
  const userId = localStorage.getItem('userId'); // <-- добавьте эту строку

  const item: RouteItem = {
    id: Date.now(),
    from: fromVal,
    to: toVal,
    distance: routeInfo.distance,
    duration: routeInfo.duration,
    transport,
    favorite: false,
    userId: userId || null
  };

    const updated = [
      item,
      ...routes
    ];

    setRoutes(updated);

    localStorage.setItem(
      'routes_history',
      JSON.stringify(updated)
    );

    try {
      await axios.post(
        '/api/map/routes',
        item
      );
    } catch {}

    setFromVal('');

    setToVal('');
  };

  const toggleFavorite = (
    id: number
  ) => {
    const updated = routes.map(
      (r) =>
        r.id === id
          ? {
              ...r,
              favorite:
                !r.favorite
            }
          : r
    );

    setRoutes(updated);

    localStorage.setItem(
      'routes_history',
      JSON.stringify(updated)
    );
  };

  const removeRoute = (
    id: number
  ) => {
    const updated =
      routes.filter(
        (r) => r.id !== id
      );

    setRoutes(updated);

    localStorage.setItem(
      'routes_history',
      JSON.stringify(updated)
    );

    axios
      .delete(
        `/api/map/routes/${id}`
      )
      .catch(() => {});
  };

  const setFromHere = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat =
          pos.coords.latitude;

        const lon =
          pos.coords.longitude;

        const str = `${lat},${lon}`;

        setFromVal(str);

        if (
          currentMarkerRef.current
        ) {
          try {
            mapRef.current.geoObjects.remove(
              currentMarkerRef.current
            );
          } catch {}
        }

        currentMarkerRef.current =
          new window.ymaps.Placemark(
            [lat, lon],
            {
              hintContent:
                'Вы здесь'
            }
          );

        mapRef.current.geoObjects.add(
          currentMarkerRef.current
        );

        mapRef.current.setCenter(
          [lat, lon],
          9
        );
      }
    );
  };

  const handleSpotClick = async (
    spot: any
  ) => {
    let from = fromVal;

    if (!from) {
      alert(
        'Сначала укажите точку отправления'
      );

      return;
    }

    const to = `${spot.coords[0]},${spot.coords[1]}`;

    setToVal(to);

    draw(from, to);
  };

  return (
    <div className="relative w-full h-screen">

      <div
        id="map-container"
        className="absolute inset-0"
      />

      <div className="absolute top-4 left-4 z-50 w-80 bg-white border rounded-xl shadow-lg p-3 space-y-3 max-h-[90vh] overflow-auto">

        <div className="text-lg font-bold">
          Маршруты
        </div>

        {routeInfo && (
          <div className="border rounded-lg p-2 text-sm flex justify-between">
            <span>
              {
                routeInfo.distance
              }
            </span>

            <span>
              {
                routeInfo.duration
              }
            </span>
          </div>
        )}

        <div className="grid grid-cols-4 gap-2">

          <button
            type="button"
            onClick={() =>
              setTransport(
                'auto'
              )
            }
            className={`border rounded-lg py-2 text-sm ${
              transport ===
              'auto'
                ? 'bg-black text-white'
                : ''
            }`}
          >
            Авто
          </button>

          <button
            type="button"
            onClick={() =>
              setTransport(
                'pedestrian'
              )
            }
            className={`border rounded-lg py-2 text-sm ${
              transport ===
              'pedestrian'
                ? 'bg-black text-white'
                : ''
            }`}
          >
            Пешком
          </button>

          <button
            type="button"
            onClick={() =>
              setTransport(
                'masstransit'
              )
            }
            className={`border rounded-lg py-2 text-sm ${
              transport ===
              'masstransit'
                ? 'bg-black text-white'
                : ''
            }`}
          >
            Транспорт
          </button>

          <button
            type="button"
            onClick={() =>
              setTransport(
                'plane'
              )
            }
            className={`border rounded-lg py-2 text-sm ${
              transport ===
              'plane'
                ? 'bg-black text-white'
                : ''
            }`}
          >
            Самолёт
          </button>

        </div>

        <form
          onSubmit={save}
          className="space-y-2"
        >

          <div className="flex gap-2">

            <input
              value={fromVal}
              onChange={(e) =>
                setFromVal(
                  e.target.value
                )
              }
              placeholder="Откуда"
              className="border rounded-lg px-3 py-2 w-full"
            />

            <button
              type="button"
              onClick={
                setFromHere
              }
              className="border px-3 rounded-lg"
            >
              GPS
            </button>

          </div>

          <input
            value={toVal}
            onChange={(e) =>
              setToVal(
                e.target.value
              )
            }
            placeholder="Куда"
            className="border rounded-lg px-3 py-2 w-full"
          />

          <div className="flex gap-2">

            <button
              type="button"
              onClick={() =>
                draw(
                  fromVal,
                  toVal
                )
              }
              className="flex-1 bg-black text-white py-2 rounded-lg"
            >
              Построить
            </button>

            <button
              type="submit"
              className="flex-1 bg-green-600 text-white py-2 rounded-lg"
            >
              Сохранить
            </button>

          </div>

        </form>

        <div className="border rounded-xl p-2">

          <div className="font-semibold mb-2">
            Точки
          </div>

          <div className="space-y-2">

            {touristSpots.map(
              (spot, i) => (
                <div
                  key={i}
                  onClick={() =>
                    handleSpotClick(
                      spot
                    )
                  }
                  className="border rounded-lg p-2 cursor-pointer hover:bg-slate-100"
                >
                  <div className="font-medium text-sm">
                    {spot.title}
                  </div>

                  <div className="text-xs text-slate-500">
                    {spot.text}
                  </div>
                </div>
              )
            )}

          </div>

        </div>

        <div className="border rounded-xl p-2">

          <div className="font-semibold mb-2">
            История
          </div>

          <div className="space-y-2">

            {routes.map((r) => (
              <div
                key={r.id}
                onClick={() =>
                  draw(
                    r.from,
                    r.to
                  )
                }
                className="border rounded-lg p-2 cursor-pointer hover:bg-slate-100"
              >

                <div className="flex justify-between items-center">

                  <div className="text-sm font-medium truncate w-40">
                    {r.from} → {r.to}
                  </div>

                  <div className="flex gap-2">

                    <button
                      onClick={(
                        e
                      ) => {
                        e.stopPropagation();

                        toggleFavorite(
                          r.id
                        );
                      }}
                    >
                      {r.favorite
                        ? '★'
                        : '☆'}
                    </button>

                    <button
                      onClick={(
                        e
                      ) => {
                        e.stopPropagation();

                        removeRoute(
                          r.id
                        );
                      }}
                    >
                      ×
                    </button>

                  </div>

                </div>

                <div className="text-xs text-slate-500 flex justify-between mt-1">

                  <span>
                    {r.distance}
                  </span>

                  <span>
                    {r.duration}
                  </span>

                </div>

                <div className="text-[11px] text-slate-400 mt-1">

                  {r.transport ===
                    'auto' &&
                    'Авто'}

                  {r.transport ===
                    'pedestrian' &&
                    'Пешком'}

                  {r.transport ===
                    'masstransit' &&
                    'Транспорт'}

                  {r.transport ===
                    'plane' &&
                    'Самолёт'}

                </div>

              </div>
            ))}

          </div>

        </div>

        {loading && (
          <div className="text-sm text-slate-500">
            Построение маршрута...
          </div>
        )}

      </div>
    </div>
  );
}