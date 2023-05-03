import { MAX_STEPS_LOGGED_IN } from '_constants'
import { userInfoStore } from '../store/userStore'

class Samplers {
  static samplerDetails = () => {
    const loggedIn = userInfoStore.state.loggedIn

    interface SamplerOptions {
      [key: string]: {
        supportsImg2Img?: boolean
        maxSteps: number
        modelValidation: (model: string) => boolean
      }
    }

    const data: SamplerOptions = {
      DDIM: {
        supportsImg2Img: true,
        maxSteps: loggedIn ? MAX_STEPS_LOGGED_IN : 50,
        modelValidation: (model: string) => model !== 'stable_diffusion_2.0'
      },
      dpmsolver: {
        maxSteps: loggedIn ? MAX_STEPS_LOGGED_IN : 50,
        modelValidation: (model: string) => model === 'stable_diffusion_2.0'
      },
      k_dpm_2_a: {
        supportsImg2Img: true,
        maxSteps: loggedIn ? MAX_STEPS_LOGGED_IN : 25,
        modelValidation: (model: string) => model !== 'stable_diffusion_2.0'
      },
      k_dpm_2: {
        supportsImg2Img: true,
        maxSteps: loggedIn ? MAX_STEPS_LOGGED_IN : 25,
        modelValidation: (model: string) => model !== 'stable_diffusion_2.0'
      },
      k_euler_a: {
        supportsImg2Img: true,
        maxSteps: loggedIn ? MAX_STEPS_LOGGED_IN : 50,
        modelValidation: (model: string) => model !== 'stable_diffusion_2.0'
      },
      k_euler: {
        supportsImg2Img: true,
        maxSteps: loggedIn ? MAX_STEPS_LOGGED_IN : 50,
        modelValidation: (model: string) => model !== 'stable_diffusion_2.0'
      },
      k_heun: {
        supportsImg2Img: true,
        maxSteps: loggedIn ? MAX_STEPS_LOGGED_IN : 25,
        modelValidation: (model: string) => model !== 'stable_diffusion_2.0'
      },
      k_lms: {
        supportsImg2Img: true,
        maxSteps: loggedIn ? MAX_STEPS_LOGGED_IN : 50,
        modelValidation: (model: string) => model !== 'stable_diffusion_2.0'
      },
      k_dpm_fast: {
        supportsImg2Img: false,
        maxSteps: loggedIn ? MAX_STEPS_LOGGED_IN : 50,
        modelValidation: (model: string) => model !== 'stable_diffusion_2.0'
      },
      k_dpm_adaptive: {
        supportsImg2Img: false,
        maxSteps: loggedIn ? MAX_STEPS_LOGGED_IN : 50,
        modelValidation: (model: string) => model !== 'stable_diffusion_2.0'
      },
      k_dpmpp_2m: {
        supportsImg2Img: false,
        maxSteps: loggedIn ? MAX_STEPS_LOGGED_IN : 50,
        modelValidation: (model: string) => model !== 'stable_diffusion_2.0'
      },
      k_dpmpp_2s_a: {
        supportsImg2Img: false,
        maxSteps: loggedIn ? MAX_STEPS_LOGGED_IN : 50,
        modelValidation: (model: string) => model !== 'stable_diffusion_2.0'
      },
      k_dpmpp_sde: {
        supportsImg2Img: false,
        maxSteps: loggedIn ? MAX_STEPS_LOGGED_IN : 50,
        modelValidation: (model: string) => model !== 'stable_diffusion_2.0'
      }
    }

    return data
  }

  static dropdownOptions = ({
    model,
    isImg2Img = false
  }: {
    model: string
    isImg2Img?: boolean | string
  }) => {
    const options: Array<{ value: string; label: string }> = []

    for (const [key, value] of Object.entries(Samplers.samplerDetails())) {
      const filterImg2Img = isImg2Img ? true : true || false
      if (
        value.modelValidation(model) &&
        value.supportsImg2Img === filterImg2Img
      ) {
        options.push({
          value: key,
          label: key
        })
      }
    }

    if (model !== 'stable_diffusion_2.0') {
      options.push({ value: 'random', label: 'Random!' })
    }

    return options
  }

  static dropdownValue = (sampler: string) => {
    if (sampler === 'random') {
      return { value: 'random', label: 'Random!' }
    }

    return { label: sampler, value: sampler }
  }
}

export default Samplers
