import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, company, service, message } = body;

        const HUBSPOT_ACCESS_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN;

        if (!HUBSPOT_ACCESS_TOKEN) {
            console.warn('HubSpot integration skipped: Missing HUBSPOT_ACCESS_TOKEN');
            return NextResponse.json({ success: false, error: 'HubSpot token not configured' }, { status: 500 });
        }

        // Split name into firstname and lastname
        const nameParts = (name || '').trim().split(/\s+/);
        const firstname = nameParts[0] || '';
        const lastname = nameParts.slice(1).join(' ') || '';

        // Combine service and message into standard HubSpot message field
        const combinedMessage = `Selected Service: ${service || 'None'}\nMessage: ${message || ''}`;

        const contactData = {
            properties: {
                email: email,
                firstname: firstname,
                lastname: lastname,
                company: company || '',
                message: combinedMessage
            }
        };

        const hubspotUrl = 'https://api.hubapi.com/crm/v3/objects/contacts';

        // 1. Attempt to create the contact
        const createRes = await fetch(hubspotUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contactData)
        });

        if (createRes.status === 201 || createRes.status === 200) {
            const data = await createRes.json();
            console.log('✅ Contact created successfully in HubSpot:', data.id);
            return NextResponse.json({ success: true, contactId: data.id, action: 'created' });
        }

        // 2. If contact already exists (409 Conflict), update it
        if (createRes.status === 409) {
            const errorData = await createRes.json();
            const match = (errorData.message || '').match(/Existing ID:\s*(\d+)/i);
            const contactId = match ? match[1] : null;

            if (contactId) {
                console.log(`ℹ️ Contact already exists with ID ${contactId}. Updating contact...`);
                
                // Do not update email in properties when patching, just firstname, lastname, company, message
                const updateData = {
                    properties: {
                        firstname: firstname,
                        lastname: lastname,
                        company: company || '',
                        message: combinedMessage
                    }
                };

                const updateRes = await fetch(`${hubspotUrl}/${contactId}`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updateData)
                });

                if (updateRes.ok) {
                    const data = await updateRes.json();
                    console.log('✅ Contact updated successfully in HubSpot:', data.id);
                    return NextResponse.json({ success: true, contactId: data.id, action: 'updated' });
                } else {
                    const updateError = await updateRes.text();
                    console.error('❌ HubSpot contact update failed:', updateError);
                    return NextResponse.json({ success: false, error: 'Failed to update existing HubSpot contact' }, { status: updateRes.status });
                }
            }
        }

        const rawError = await createRes.text();
        console.error('❌ HubSpot contact creation failed:', rawError);
        return NextResponse.json({ success: false, error: 'HubSpot API Error' }, { status: createRes.status });

    } catch (error: any) {
        console.error('❌ HubSpot integration exception:', error);
        return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
    }
}
