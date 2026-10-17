import SafeImage from './SafeImage'
import { isMobileProject, isHybridProject } from '../../constants/projects'
import type { Project } from '../../constants/projects'
export default function ProjectCover({
  project,
  variant,
}: {
  project: Project
  variant: 'card' | 'hero'
}) {
  // Web + phone together
  if (isHybridProject(project) && project.mobileImage) {
    return (
      <div className="relative h-full w-full">
        <SafeImage
          src={project.image}
          alt={`${project.title} web cover`}
          loading={variant === 'card' ? 'lazy' : undefined}
          className="h-full w-full object-contain p-3 pr-[28%]"
        />
        <div className="absolute bottom-3 right-3 aspect-[9/19] h-[82%] overflow-hidden rounded-xl border border-line bg-paper shadow-xl">
          <SafeImage
            src={project.mobileImage}
            alt={`${project.title} mobile cover`}
            loading={variant === 'card' ? 'lazy' : undefined}
            className="h-full w-full object-cover object-top"
          />
        </div>
      </div>
    )
  }

  // Mobile only
  if (isMobileProject(project)) {
    return (
      <SafeImage
        src={project.image}
        alt={`${project.title} cover`}
        loading={variant === 'card' ? 'lazy' : undefined}
        className={variant === 'hero' ? 'h-full w-auto max-w-full object-contain' : 'h-full w-full object-contain p-3'}
      />
    )
  }

  // Web only
  return (
    <SafeImage
      src={project.image}
      alt={`${project.title} cover`}
      loading={variant === 'card' ? 'lazy' : undefined}
      className="h-full w-full object-contain"
    />
  )
}