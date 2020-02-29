// Для использования данного плагина
//
// в HTML необходимо обернуть любой контентный текст
// в div с классом .scroll-parallax
// и добавить ему атрибут data-parallax-image,
// в котором хранить путь к картинке для эффекта с паралаксом
//
// <div class=".scroll-parallax" data-parallax-image="./img">
//    Текст текст текст
// </div>
//
// После отработки данного скрипта в DOM появится следующая структура
//
// <div class=".scroll-parallax" data-parallax-image="./img">
//    <div class="scroll-parallax__image"></div>
//    <div class="scroll-parallax__content">Текст текст текст</div>
// </div>
//
// В div с классом scroll-parallax__image будет фоном размещена картинка
//
// =============================================================================
//
// Для установки высоты блока с эффектом паралакса в CSS необходимо установить
// .scroll-parallax {
//    min-height: 400px;
// }
//
// =============================================================================
//
// Для подключения данного плагина необходимо в JS добавить следующую запись
// $('.scroll-parallax').scrollParallax();
//
// По умолчанию скорость перемещения картинки в блоке с эффектом паралакса,
// в два раза выше скорости прокрутки страницы
//
// Доступна настройка скорости эффекта
// $('.scroll-parallax').scrollParallax(
//    { parallaxSpeed: 3 }
// );
//
// Возможно использовать для разных блоков разную скорость,
// в таком случае необходим в каждом блоке установить id
// и уточнить строку подключения для каждого блока
// $('.scroll-parallax#id_1').scrollParallax(
//    { parallaxSpeed: 3 }
// );
//
// Значение parallaxSpeed равное 1 отключает эффект паралакса
// parallaxSpeed не может быть меньше 1
// высокие значения parallaxSpeed могут привести к чрезмерному
// растягиванию картинки по высоте.
//
// Растягивание картинки будет всегда при условии, когда
// установленная в CSS высота блока
// умноженная на parallaxSpeed
// больше физической высоты картинки
//
// Внимание! Данное правило может нарушаться при малых размерах экрана.
//
// Чтобы растягивание картинки не проявлялось,
// необходимо подбирать картинки с большой высотой
// =============================================================================

'use strict';
(() => {
  $.fn.scrollParallax = function(userOptions) {
    return this.each(function() {
      // === настройки по умолчанию
      const defaults = {
        parallaxSpeed: 2,
      };

      // === уточнение настроек в зависимости от пользовательского ввода

      if (userOptions.parallaxSpeed < 1) {
        // минимальное ограничение скорости
        userOptions.parallaxSpeed = 1;
      }
      const options = $.extend(defaults, userOptions);

      // === переменная хранящая this
      const $this = $(this);

      // === обертка для контентной части паралакса ==============================
      const $parallaxContent = document.createElement('div');

      $parallaxContent.classList.add('scroll-parallax__content');
      $parallaxContent.style.cssText = `
      position: relative;
      z-index: 1;
    `;

      // === блок с картинкой ====================================================
      const $parallaxImage = document.createElement('div');

      $parallaxImage.classList.add('scroll-parallax__image');
      $parallaxImage.style.cssText = `
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;

      width: 100%;

      background: url('${$this.data('parallax-image')}');
      background-repeat: no-repeat;
      background-position: center center;
      background-size: cover;
    `;

      // === предварительное изменение DOM =======================================
      $this
        // === внешний блок с паралаксом
        .css({
          position: 'relative',
          overflow: 'hidden',
        })
        // === обертка для контента
        .wrapInner($parallaxContent)
        // === блок с картинкой в фоне
        .prepend($parallaxImage);

      // === начальная прорисовка блока .scroll-parallax
      function parallaxMove() {
        const parallaxHeight = $this.height();
        // высота блока с паралаксом

        const windowHeight = $(window).height();
        // высота окна

        const windowPosition = $(document).scrollTop();
        // позиция окна в документе

        const parallaxPositionInDocument = $this.offset().top;
        // позиция блока с паралаксом в документе

        const parallaxPositionInWindow =
          parallaxPositionInDocument - windowPosition;
        // позиция блока с паралаксом в окне

        // =====================================================================
        // === установить блоку с картинкой высоту в два раза большую,
        // равную высоте блока с эффектом паралакса умноженной
        // на скорость перемещения картинки в блоке
        $this.children('.scroll-parallax__image').css({
          height: parallaxHeight * options.parallaxSpeed,
        });

        // === если блок с паралаксом в видимой части документа,
        // то пересчитывать эффект паралакса
        if (
          parallaxPositionInWindow + parallaxHeight >= 0 &&
          parallaxPositionInWindow <= windowHeight
        ) {
          const realPositionParallaxInWindow =
            windowHeight - parallaxPositionInWindow;
          // позиция верха блока относительно низа окна

          const maxVerticalDistance = windowHeight + parallaxHeight;
          // максимальное вертикальное расстояние, которое может пройти блок

          const percentOfWay =
            realPositionParallaxInWindow / maxVerticalDistance;
          // процент пройденного блоком вертикального расстояния

          const imageHeight = $this
            .children('.scroll-parallax__image')
            .height();
          // высота картинки

          const imageRelocate =
            (imageHeight - parallaxHeight) * percentOfWay * -1;

          // === перемещение блока .scroll-parallax__image с картинкой в фоне
          $this.children('.scroll-parallax__image').css({
            transform: `translate(0px, ${imageRelocate}px)`,
          });
        }
      }

      // === инициализация функций
      $(window)
        // === во время полной загрузки окна браузера
        .on('load', function() {
          parallaxMove();
        })
        // === во время скролла
        .on('scroll', function() {
          parallaxMove();
        })
        // === во время изменения размеров окна
        .on('resize', function() {
          parallaxMove();
        });
    });
  };
})(jQuery);

// =============================================================================
$('.scroll-parallax#id_1').scrollParallax({ parallaxSpeed: 1.8 });
$('.scroll-parallax#id_2').scrollParallax({ parallaxSpeed: 2.1 });
