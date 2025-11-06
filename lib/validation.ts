// Domain Name Validation Utilities

export interface DomainValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates a domain name according to contract rules:
 * - Must be > 4 characters
 * - Must be <= 40 characters
 * - Must end with .ntu
 */
export function validateDomainName(domain: string): DomainValidationResult {
  const trimmedDomain = domain.trim();

  if (!trimmedDomain) {
    return {
      isValid: false,
      error: 'Domain name cannot be empty',
    };
  }

  // Check minimum length
  if (trimmedDomain.length <= 4) {
    return {
      isValid: false,
      error: 'Domain name is too short (minimum 5 characters)',
    };
  }

  // Check maximum length
  if (trimmedDomain.length > 40) {
    return {
      isValid: false,
      error: 'Domain name is too long (maximum 40 characters)',
    };
  }

  // Check .ntu extension
  if (!trimmedDomain.endsWith('.ntu')) {
    return {
      isValid: false,
      error: 'Domain must end with .ntu',
    };
  }

  // Check that there's content before .ntu
  const nameBeforeExtension = trimmedDomain.slice(0, -4);
  if (nameBeforeExtension.length === 0) {
    return {
      isValid: false,
      error: 'Domain name cannot be just .ntu',
    };
  }

  return {
    isValid: true,
  };
}

/**
 * Formats a domain name input by ensuring it has .ntu extension
 */
export function formatDomainName(input: string): string {
  const trimmed = input.toLowerCase().trim();
  if (!trimmed) return '';
  
  // If already has .ntu, return as is
  if (trimmed.endsWith('.ntu')) {
    return trimmed;
  }
  
  // Add .ntu extension
  return `${trimmed}.ntu`;
}

/**
 * Get the domain name without the .ntu extension
 */
export function getDomainBaseName(domain: string): string {
  if (domain.endsWith('.ntu')) {
    return domain.slice(0, -4);
  }
  return domain;
}



