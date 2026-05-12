package com.promorural.api.core.application.service.use_case.admin;

import com.promorural.api.core.application.dto.admin.ContactCreateRequest;
import com.promorural.api.core.application.dto.admin.ContactUpdateRequest;
import com.promorural.api.core.application.dto.guest.ContactResponse;
import com.promorural.api.core.application.mapper.CategoryMapper;
import com.promorural.api.core.domain.entity.Category;
import com.promorural.api.core.domain.entity.Contact;
import com.promorural.api.core.domain.exception.BadRequestException;
import com.promorural.api.core.domain.exception.ResourceNotFoundException;
import com.promorural.api.core.domain.repository.CategoryRepository;
import com.promorural.api.core.domain.repository.ContactRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ContactUseCase {

    private final ContactRepository contactRepository;
    private final CategoryRepository categoryRepository;

    public ContactUseCase(ContactRepository contactRepository, CategoryRepository categoryRepository) {
        this.contactRepository = contactRepository;
        this.categoryRepository = categoryRepository;
    }

    public ContactResponse create(ContactCreateRequest request) {
        Long categoryId = request.categoryId();
        if (categoryId == null) {
            throw new BadRequestException("CategoryId cannot be null for Contact");
        }
        Category category = categoryRepository.findById(categoryId)
            .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + categoryId));
        Contact contact = new Contact();
        contact.setServiceName(request.serviceName());
        contact.setPhoneNumber(request.phoneNumber());
        contact.setIconName(request.iconName());
        contact.setCategory(category);
        Contact savedContact = contactRepository.save(contact);
        return mapToResponse(savedContact);
    }

    public ContactResponse update(Long id, ContactUpdateRequest request) {
        if (id == null) {
            throw new BadRequestException("Contact ID cannot be null");
        }
        Contact contact = contactRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Contact not found with ID: " + id));
        Long categoryId = request.categoryId();
        if (categoryId != null) {
            Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + categoryId));
            contact.setCategory(category);
        }
        if (request.serviceName() != null) { contact.setServiceName(request.serviceName()); }
        if (request.phoneNumber() != null) { contact.setPhoneNumber(request.phoneNumber()); }
        if (request.iconName() != null) { contact.setIconName(request.iconName()); }
        Contact updatedContact = contactRepository.save(contact);
        return mapToResponse(updatedContact);
    }

    public void delete(Long id) {
        if (id == null) {
            throw new BadRequestException("Contact ID cannot be null");
        }
        if (!contactRepository.existsById(id)) {
            throw new ResourceNotFoundException("Contact not found with ID: " + id);
        }
        contactRepository.deleteById(id);
    }

    private ContactResponse mapToResponse(Contact contact) {
        if (contact == null) return null;
        return new ContactResponse(
                contact.getId(),
                contact.getServiceName(),
                contact.getPhoneNumber(),
                contact.getIconName(),
                CategoryMapper.toGuestResponse(contact.getCategory())
        );
    }
}
