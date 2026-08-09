import EmblaCarousel from 'embla-carousel'
import { setupTweenOpacity } from './EmblaCarouselTweenOpacity'
import { addDotButtonAndClickHandlers } from './EmblaCarouselDotButton'
import { addPrevNextButtonClickHandlers } from './EmblaCarouselArrowButtons'
import { setupLazyLoadImage } from './EmblaCarouselLazyLoad'
import './embla.css'

const OPTIONS = { loop: true }

const emblaNode = document.querySelector('.embla')
const viewportNode = emblaNode.querySelector('.embla__viewport')
const prevBtn = emblaNode.querySelector('.embla__button--prev')
const nextBtn = emblaNode.querySelector('.embla__button--next')
const dotsNode = document.querySelector('.embla__dots')

const emblaApi = EmblaCarousel(viewportNode, OPTIONS)

const loadImagesInView = setupLazyLoadImage(emblaApi)

setupTweenOpacity(emblaApi)
addPrevNextButtonClickHandlers(emblaApi, prevBtn, nextBtn)
addDotButtonAndClickHandlers(emblaApi, dotsNode)

loadImagesInView(emblaApi)
emblaApi.on('reInit', loadImagesInView).on('slidesInView', loadImagesInView)
